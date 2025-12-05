import { IconSymbol } from '@/components/ui/icon-symbol';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useSleepMode } from '../contexts/SleepModeContext';

const { width, height } = Dimensions.get('window');

const QUOTES = [
    "Sleep is the best meditation.",
    "A ruffled mind makes a restless pillow.",
    "Early to bed and early to rise makes a man healthy, wealthy, and wise.",
    "The best bridge between despair and hope is a good night's sleep.",
    "Man should forget his anger before he lies down to sleep.",
    "Sleep is the golden chain that ties health and our bodies together.",
    "There is a time for many words, and there is also a time for sleep.",
    "To achieve the impossible dream, try going to sleep.",
    "Your future depends on your dreams, so go to sleep.",
    "Rest is not idleness, and to lie sometimes on the grass under trees on a summer's day, listening to the murmur of the water, or watching the clouds float across the sky, is by no means a waste of time."
];

// Public domain white noise sample
const WHITE_NOISE_URI = 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg'; // Using a placeholder, ideally use a real white noise file

export default function SleepMode() {
    const router = useRouter();
    const { isSleepMode, toggleSleepMode } = useSleepMode();
    const opacity = useSharedValue(0);
    const scale = useSharedValue(1);
    const glow = useSharedValue(0.5);

    // Existing emergency countdown (for routing)
    const [emergencyCountdown, setEmergencyCountdown] = useState<number | null>(null);
    const emergencyTimerRef = useRef<any>(null);

    // New emergency state for overlay and alarm
    const [isEmergency, setIsEmergency] = useState(false);
    const [emergencyDescription, setEmergencyDescription] = useState('');
    const [emergencyCallTimer, setEmergencyCallTimer] = useState(15); // Renamed to avoid conflict
    const alarmSoundRef = useRef<Audio.Sound | null>(null);
    const shouldPlayAlarmRef = useRef(false);

    const playAlarm = async () => {
        shouldPlayAlarmRef.current = true;
        try {
            // Using a loud alarm sound URL
            const { sound } = await Audio.Sound.createAsync(
                { uri: 'https://www.soundjay.com/mechanical/sounds/smoke-detector-1.mp3' },
                { shouldPlay: false, isLooping: true, volume: 1.0 }
            );

            if (!shouldPlayAlarmRef.current) {
                await sound.unloadAsync();
                return;
            }

            alarmSoundRef.current = sound;
            await sound.playAsync();
        } catch (error) {
            console.error("Failed to play alarm", error);
        }
    };

    const stopAlarm = async () => {
        shouldPlayAlarmRef.current = false;
        if (alarmSoundRef.current) {
            try {
                await alarmSoundRef.current.stopAsync();
                await alarmSoundRef.current.unloadAsync();
            } catch (e) { console.log("Error stopping alarm:", e); }
            alarmSoundRef.current = null;
        }
    };

    useEffect(() => {
        let interval: any;
        if (isEmergency && emergencyCallTimer > 0) {
            interval = setInterval(() => {
                setEmergencyCallTimer((prev) => prev - 1);
            }, 1000);
        } else if (emergencyCallTimer === 0 && isEmergency) {
            // Timer finished, simulate calling emergency services
            console.log("Calling Emergency Services...");
            // Here you would integrate with actual emergency services API or local notification
            // For now, we'll just stop the alarm and keep the overlay
            stopAlarm();
        }
        return () => clearInterval(interval);
    }, [isEmergency, emergencyCallTimer]);

    const triggerEmergencyProtocol = (description: string) => {
        // Activate Emergency Overlay immediately
        setEmergencyDescription(description);
        setIsEmergency(true);
        setEmergencyCallTimer(15);
        playAlarm();

        console.log("Emergency Triggered:", description);
    };

    const dismissEmergency = () => {
        setIsEmergency(false);
        stopAlarm();
    };

    const cancelEmergency = () => {
        if (emergencyTimerRef.current) clearInterval(emergencyTimerRef.current);
        setEmergencyCountdown(null);
    };

    const [quote, setQuote] = useState("");
    const [heartRate, setHeartRate] = useState(60);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [metering, setMetering] = useState(-160);
    const lastAnalysisTime = useRef(0);
    const lastCheckTime = useRef(0);

    const soundRef = useRef<Audio.Sound | null>(null);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const muteStartTimeRef = useRef<number | null>(null);
    const totalMutedDurationRef = useRef(0);

    // Waveform Animation Values
    const bar1 = useSharedValue(10);
    const bar2 = useSharedValue(15);
    const bar3 = useSharedValue(20);
    const bar4 = useSharedValue(15);
    const bar5 = useSharedValue(10);

    const handleRecord = async () => {
        if (Platform.OS === 'web') {
            alert("Recording is not supported on Web. Please use a Simulator or Device.");
            return;
        }
        if (isRecording) {
            // Stop recording
            setIsRecording(false);
            setIsProcessing(true);
            try {
                if (recordingRef.current) {
                    await recordingRef.current.stopAndUnloadAsync();
                    const uri = recordingRef.current.getURI();
                    recordingRef.current = null;

                    if (uri) {
                        // Upload
                        const formData = new FormData();
                        formData.append('file', {
                            uri,
                            name: 'recording.m4a',
                            type: 'audio/m4a'
                        } as any);

                        const response = await fetch('http://192.168.5.146:8000/analyze-audio', {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });

                        const result = await response.json();
                        console.log("Audio Analysis:", result);

                        if (result.status === "Emergency") {
                            triggerEmergencyProtocol(result.description);
                        } else if (result.status === "Awake") {
                            alert("Awake Detected: " + result.description);
                        } else {
                            alert("Sleep is Normal: " + result.description);
                        }
                    }
                }
            } catch (error) {
                console.error("Recording error:", error);
                alert("Failed to analyze audio");
            } finally {
                setIsProcessing(false);
            }
        } else {
            // Start recording
            try {
                await Audio.requestPermissionsAsync();
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });

                const recording = new Audio.Recording();
                await recording.prepareToRecordAsync({
                    ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
                    isMeteringEnabled: true,
                });
                await recording.startAsync();
                recordingRef.current = recording;
                setIsRecording(true);
            } catch (err) {
                console.error('Failed to start recording', err);
            }
        }
    };

    // Passive Recording Logic
    useEffect(() => {
        if (isSleepMode && !isMuted) {
            startPassiveRecording();
        } else {
            stopPassiveRecording();
        }
        return () => { stopPassiveRecording(); };
    }, [isSleepMode, isMuted]);

    const startPassiveRecording = async () => {
        if (Platform.OS === 'web') {
            console.log("Passive recording disabled on Web");
            return;
        }
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
            });

            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync({
                ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
                isMeteringEnabled: true,
            });

            recording.setOnRecordingStatusUpdate((status) => {
                if (status.isRecording) {
                    // Metering is usually negative dB (e.g., -160 to 0)
                    const currentMetering = status.metering ?? -160;
                    setMetering(currentMetering);
                    console.log("Metering:", currentMetering);

                    // Only check for analysis every 3 seconds to avoid false positives from tapping the screen
                    if (Date.now() - lastCheckTime.current > 3000) {
                        lastCheckTime.current = Date.now(); // Reset last check time
                        if (currentMetering > -45 && (Date.now() - lastAnalysisTime.current > 10000)) {
                            console.log("Loud noise detected! Analyzing...", currentMetering);
                            analyzeCurrentRecording(recording);
                        }
                    }
                }
            });

            recording.setProgressUpdateInterval(100); // Ensure updates every 100ms

            await recording.startAsync();
            recordingRef.current = recording;
        } catch (err) {
            console.error('Failed to start passive recording', err);
        }
    };

    const stopPassiveRecording = async () => {
        if (recordingRef.current) {
            try {
                await recordingRef.current.stopAndUnloadAsync();
            } catch (e) { }
            recordingRef.current = null;
        }
    };

    const analyzeCurrentRecording = async (recording: Audio.Recording) => {
        lastAnalysisTime.current = Date.now();

        try {
            // Stop and unload to get the file
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            recordingRef.current = null; // Clear ref so we don't try to stop it again

            if (uri) {
                // Upload in background
                const formData = new FormData();
                formData.append('file', {
                    uri,
                    name: 'recording.m4a',
                    type: 'audio/m4a'
                } as any);

                fetch('http://192.168.5.146:8000/analyze-audio', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).then(res => res.json()).then(result => {
                    console.log("Auto-Analysis Result:", result);
                    if (result.status === "Emergency") {
                        triggerEmergencyProtocol(result.description);
                    }
                }).catch(err => console.error("Auto-Analysis Failed", err));
            }

            // Restart recording immediately
            if (isSleepMode && !isMuted) {
                startPassiveRecording();
            }
        } catch (e) {
            console.error("Failed to analyze recording", e);
            // Try to restart if failed
            if (isSleepMode && !isMuted) {
                startPassiveRecording();
            }
        }
    };

    // Drive animation with metering
    useEffect(() => {
        // Improved Sensitivity
        // Map -60dB (quiet) to 0, -10dB (loud) to 100
        // Formula: (metering + 60) * 2
        // Let's make it more sensitive: (metering + 50) * 3
        // If metering is -160 (silent), level is 0.
        // If metering is -40 (talking), level is (-40+60)*3 = 60.
        const sensitivity = 4;
        const offset = 60;
        const level = Math.max(0, (metering + offset) * sensitivity);

        bar1.value = withTiming(Math.max(10, level * 0.6 + Math.random() * 15), { duration: 100 });
        bar2.value = withTiming(Math.max(10, level * 0.9 + Math.random() * 25), { duration: 100 });
        bar3.value = withTiming(Math.max(10, level * 1.2 + Math.random() * 35), { duration: 100 });
        bar4.value = withTiming(Math.max(10, level * 0.9 + Math.random() * 25), { duration: 100 });
        bar5.value = withTiming(Math.max(10, level * 0.6 + Math.random() * 15), { duration: 100 });
    }, [metering]);

    const startTimeRef = useRef(Date.now());

    // Reset start time when sleep mode activates
    useEffect(() => {
        if (isSleepMode) {
            startTimeRef.current = Date.now();
        }
    }, [isSleepMode]);

    const handleWakeUp = async () => {
        // Calculate duration
        const endTime = Date.now();
        const durationMs = endTime - startTimeRef.current;

        // Calculate final penalty
        if (isMuted && muteStartTimeRef.current) {
            totalMutedDurationRef.current += (Date.now() - muteStartTimeRef.current);
        }

        // Convert to hours (for demo, maybe seconds = minutes?)
        // User said "longer than an hour". Let's assume real time for logic, but maybe scale for demo?
        // Let's stick to the requirement: > 1 hour.
        const hoursMuted = totalMutedDurationRef.current / (1000 * 60 * 60);

        if (hoursMuted > 1) {
            // Apply penalty (call backend)
            // For demo, we can just log it or pass it to summary
            console.log("Penalty applied for muting > 1 hour");
        }

        // Trigger AI Analysis for the session
        fetch('http://192.168.5.146:8000/analyze-session', { method: 'POST' })
            .then(res => res.json())
            .then(data => console.log("Session Analysis Triggered:", data.summary))
            .catch(err => console.error("Failed to trigger session analysis", err));

        toggleSleepMode();
        // Navigate to summary after a short delay to allow animation to start closing
        setTimeout(() => {
            router.push({
                pathname: '/sleep-summary',
                params: { durationMs: durationMs.toString() }
            });
        }, 300);
    };

    // Heart Rate Simulation
    useEffect(() => {
        if (!isSleepMode) return;

        const interval = setInterval(() => {
            // Fluctuate between 58 and 65
            const newRate = Math.floor(Math.random() * (65 - 58 + 1) + 58);
            setHeartRate(newRate);
        }, 2000);

        return () => clearInterval(interval);
    }, [isSleepMode]);

    // Quote Selection
    useEffect(() => {
        if (isSleepMode) {
            const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
            setQuote(randomQuote);
        }
    }, [isSleepMode]);

    // Animation Effect
    useEffect(() => {
        if (isSleepMode) {
            // Clear previous events for new session
            fetch('http://192.168.5.146:8000/clear-events', { method: 'POST' })
                .catch(err => console.error("Failed to clear events", err));

            opacity.value = withTiming(1, { duration: 500 });
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
            glow.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 2000 }),
                    withTiming(0.5, { duration: 2000 })
                ),
                -1,
                true
            );
        } else {
            opacity.value = withTiming(0, { duration: 300 });
            stopMusic(); // Stop music on exit
        }
    }, [isSleepMode]);

    // Music Player Logic
    const toggleMusic = async () => {
        try {
            if (soundRef.current) {
                if (isPlaying) {
                    await soundRef.current.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await soundRef.current.playAsync();
                    setIsPlaying(true);
                }
            } else {
                // Load sound
                const { sound } = await Audio.Sound.createAsync(
                    { uri: WHITE_NOISE_URI },
                    { shouldPlay: true, isLooping: true }
                );
                soundRef.current = sound;
                setIsPlaying(true);
            }
        } catch (error) {
            console.log("Error playing sound:", error);
        }
    };

    const stopMusic = async () => {
        if (soundRef.current) {
            await soundRef.current.unloadAsync();
            soundRef.current = null;
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        const now = Date.now();
        if (isMuted) {
            // Unmuting
            if (muteStartTimeRef.current) {
                totalMutedDurationRef.current += (now - muteStartTimeRef.current);
                muteStartTimeRef.current = null;
            }
            setIsMuted(false);
        } else {
            // Muting
            muteStartTimeRef.current = now;
            setIsMuted(true);
        }
    };

    const [isLocked, setIsLocked] = useState(false);
    const [unlockTapCount, setUnlockTapCount] = useState(0);
    const unlockTimeoutRef = useRef<any>(null);

    const handleLockToggle = () => {
        if (!isLocked) {
            setIsLocked(true);
            setUnlockTapCount(0);
        } else {
            const newCount = unlockTapCount + 1;
            setUnlockTapCount(newCount);

            if (unlockTimeoutRef.current) clearTimeout(unlockTimeoutRef.current);
            unlockTimeoutRef.current = setTimeout(() => {
                setUnlockTapCount(0);
            }, 1000); // Reset if not tapped quickly enough

            if (newCount >= 4) {
                setIsLocked(false);
                setUnlockTapCount(0);
                if (unlockTimeoutRef.current) clearTimeout(unlockTimeoutRef.current);
            }
        }
    };

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const containerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        zIndex: isSleepMode ? 9999 : -1,
    }));

    const circleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: glow.value,
    }));

    const barStyle1 = useAnimatedStyle(() => ({ height: bar1.value }));
    const barStyle2 = useAnimatedStyle(() => ({ height: bar2.value }));
    const barStyle3 = useAnimatedStyle(() => ({ height: bar3.value }));
    const barStyle4 = useAnimatedStyle(() => ({ height: bar4.value }));
    const barStyle5 = useAnimatedStyle(() => ({ height: bar5.value }));

    if (!isSleepMode) return null;

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            <StatusBar hidden={true} />
            <TouchableOpacity activeOpacity={1} onPress={isLocked ? undefined : toggleSleepMode} style={styles.touchable}>
                <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]} />

                <View style={[styles.mainLayout, isLandscape && styles.mainLayoutLandscape]}>
                    <View style={[styles.content, isLandscape && styles.contentLandscape]}>
                        <Animated.View style={[styles.glowCircle, circleStyle]} />

                        {/* Waveform Visualization */}
                        {!isMuted && (
                            <View style={styles.waveformContainer}>
                                <Animated.View style={[styles.bar, barStyle1]} />
                                <Animated.View style={[styles.bar, barStyle2]} />
                                <Animated.View style={[styles.bar, barStyle3]} />
                                <Animated.View style={[styles.bar, barStyle4]} />
                                <Animated.View style={[styles.bar, barStyle5]} />
                            </View>
                        )}

                        {isMuted && (
                            <View style={styles.mutedContainer}>
                                <IconSymbol name="mic.slash.fill" size={32} color="rgba(255,255,255,0.5)" />
                                <Text style={styles.mutedText}>Muted</Text>
                            </View>
                        )}

                        <Text style={styles.text}>{isLocked ? "Device Locked" : "Sleep Mode"}</Text>

                        {!isLandscape && (
                            <View style={styles.quoteContainer}>
                                <Text style={styles.quoteText}>"{quote}"</Text>
                            </View>
                        )}

                        <View style={styles.heartRateContainer}>
                            <IconSymbol name="heart.fill" size={20} color="#ef4444" />
                            <Text style={styles.heartRateText}>{heartRate} BPM</Text>
                        </View>
                    </View>

                    {/* Controls */}
                    <View style={[styles.controls, isLandscape && styles.controlsLandscape]}>
                        {!isLocked && (
                            <>
                                <TouchableOpacity style={styles.controlButton} onPress={toggleMusic}>
                                    <IconSymbol
                                        name={isPlaying ? "pause.fill" : "play.fill"}
                                        size={28}
                                        color="#fff"
                                    />
                                    <Text style={styles.controlText}>{isPlaying ? "Pause" : "Play"}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.controlButton, { backgroundColor: isMuted ? '#7f1d1d' : 'rgba(255,255,255,0.1)' }]}
                                    onPress={toggleMute}
                                >
                                    <IconSymbol
                                        name={isMuted ? "mic.slash.fill" : "mic.fill"}
                                        size={28}
                                        color="#fff"
                                    />
                                    <Text style={styles.controlText}>{isMuted ? "Unmute" : "Mute"}</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        <TouchableOpacity
                            style={[styles.controlButton, isLocked && { backgroundColor: 'rgba(220, 38, 38, 0.2)', borderColor: '#ef4444', borderWidth: 1 }]}
                            onPress={handleLockToggle}
                        >
                            <IconSymbol
                                name={isLocked ? "lock.fill" : "lock.open.fill"}
                                size={28}
                                color="#fff"
                            />
                            <Text style={styles.controlText}>
                                {isLocked ? (unlockTapCount > 0 ? `${4 - unlockTapCount} more` : "Unlock") : "Lock"}
                            </Text>
                        </TouchableOpacity>

                        {!isLocked && (
                            <TouchableOpacity style={styles.exitButton} onPress={handleWakeUp}>
                                <Text style={styles.exitText}>Wake Up</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            {/* Emergency Overlay */}
            {isEmergency && (
                <View style={styles.emergencyContainer}>
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(20, 0, 0, 0.95)' }]} />
                    <Text style={styles.emergencyTitle}>EMERGENCY DETECTED</Text>
                    <Text style={styles.emergencySubtitle}>Contacts Notified</Text>

                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>{emergencyCallTimer}</Text>
                        <Text style={styles.timerLabel}>seconds to auto-call services</Text>
                    </View>

                    <Text style={styles.emergencyText}>{emergencyDescription}</Text>

                    <TouchableOpacity style={styles.emergencyButton} onPress={dismissEmergency}>
                        <Text style={styles.emergencyButtonText}>I'M OK - CANCEL</Text>
                    </TouchableOpacity>
                </View>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    touchable: {
        flex: 1,
        width: '100%',
    },
    mainLayout: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 40,
    },
    mainLayoutLandscape: {
        flexDirection: 'row',
        paddingHorizontal: 40,
        paddingVertical: 20,
    },
    content: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    contentLandscape: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    glowCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#7f1d1d', // Red-900
        position: 'absolute',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 20,
    },
    text: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '300',
        letterSpacing: 2,
        zIndex: 1,
        textTransform: 'uppercase',
    },
    subText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    quoteContainer: {
        paddingHorizontal: 40,
        maxWidth: 400,
    },
    quoteText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 24,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
        width: '100%',
        paddingBottom: 20,
    },
    controlsLandscape: {
        flexDirection: 'column',
        width: 'auto',
        height: '100%',
        justifyContent: 'center',
        paddingBottom: 0,
        paddingLeft: 40,
    },
    controlButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    controlText: {
        color: '#fff',
        marginTop: 4,
        fontSize: 10,
        fontWeight: '600',
    },
    exitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(220, 38, 38, 0.2)', // Red tint
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    exitText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '700',
    },
    waveformContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        gap: 6,
    },
    bar: {
        width: 8,
        backgroundColor: '#ef4444',
        borderRadius: 4,
    },
    mutedContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    mutedText: {
        color: 'rgba(255,255,255,0.6)',
        marginTop: 8,
        fontSize: 12,
        fontWeight: '500',
    },
    heartRateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    heartRateText: {
        color: '#fca5a5', // Red-300
        fontSize: 12,
    },
    emergencyOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    emergencyBox: {
        backgroundColor: '#1a0505',
        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
        width: '80%',
        maxWidth: 400,
        borderWidth: 2,
        borderColor: '#ef4444',
    },
    emergencyTitle: {
        color: '#ef4444',
        fontSize: 24,
        fontWeight: '800',
        marginTop: 16,
    },
    emergencyText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 8,
        marginBottom: 24,
        textAlign: 'center',
    },
    emergencyCount: {
        color: '#ef4444',
        fontSize: 48,
        fontWeight: '900',
        marginBottom: 32,
    },
    dismissButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    dismissText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: '600',
    },
    emergencyContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        padding: 20,
    },
    emergencySubtitle: {
        color: '#ffaaaa',
        fontSize: 18,
        marginBottom: 20,
        fontFamily: 'Inter_500Medium',
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 30,
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 100,
        width: 200,
        height: 200,
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#ef4444',
    },
    timerText: {
        color: '#ef4444',
        fontSize: 64,
        fontFamily: 'Inter_700Bold',
    },
    timerLabel: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5,
    },
    emergencyButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    emergencyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
    },
});
