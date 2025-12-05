import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder for backend URL
const BACKEND_URL = 'http://192.168.5.146:8000';

export default function SleepSummaryScreen() {
    const router = useRouter();
    const { durationMs } = useLocalSearchParams();

    const formatDuration = (ms: string | string[] | undefined) => {
        if (!ms) return "0h 0m";
        const duration = parseInt(Array.isArray(ms) ? ms[0] : ms, 10);
        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        if (hours === 0 && minutes === 0) {
            const seconds = Math.floor(duration / 1000);
            return `${seconds}s`;
        }
        return `${hours}h ${minutes}m`;
    };

    const sleepDuration = formatDuration(durationMs);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ daily_score: number; total_score: number; date: string } | null>(null);
    const [events, setEvents] = useState<any[]>([]);

    const scoreScale = useSharedValue(0.5);
    const scoreOpacity = useSharedValue(0);

    useEffect(() => {
        fetchSleepScore();
        fetchAudioEvents();
    }, []);

    const fetchSleepScore = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/sleep-score`);
            const result = await response.json();
            console.log("Sleep Summary Score Data:", result);
            setData(result);

            // Animate score in
            scoreOpacity.value = withTiming(1, { duration: 800 });
            scoreScale.value = withSpring(1);
        } catch (error) {
            console.error('Failed to fetch sleep score:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAudioEvents = async () => {
        try {
            const response = await fetch('http://192.168.5.146:8000/session-events');
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Failed to fetch audio events", error);
        }
    };

    const animatedScoreStyle = useAnimatedStyle(() => ({
        opacity: scoreOpacity.value,
        transform: [{ scale: scoreScale.value }],
    }));

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Analyzing your sleep...</Text>
            </View>
        );
    }

    if (!data) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Could not load sleep summary.</Text>
                <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isPositive = data.daily_score >= 0;
    const message = isPositive
        ? "Great job! You're sleeping like a pro."
        : "Don't worry, you can always improve tonight.";
    const iconName = isPositive ? "star.fill" : "arrow.up.circle.fill";
    const iconColor = isPositive ? "#fbbf24" : "#3b82f6"; // Amber vs Blue

    // Calculate previous score to show the addition
    // If total = prev + daily*mult, it's hard to reverse exactly without multiplier.
    // Let's just show "Previous Total + Daily Change = New Total" conceptually.
    // We'll just display the Daily Change prominently.

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
                    <Text style={styles.date}>{data.date}</Text>
                    <Text style={styles.title}>Sleep Summary</Text>
                </Animated.View>

                <Animated.View style={[styles.scoreContainer, animatedScoreStyle]}>
                    <View style={styles.ring}>
                        <Text style={styles.totalScore}>{data.total_score}</Text>
                        <Text style={styles.totalLabel}>Total Sleep Score</Text>
                    </View>

                    <View style={styles.changeBadge}>
                        <Text style={[styles.changeText, { color: isPositive ? '#10b981' : '#ef4444' }]}>
                            {isPositive ? '+' : ''}{data.daily_score}
                        </Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(600)} style={styles.messageContainer}>
                    <IconSymbol name={iconName} size={40} color={iconColor} />
                    <Text style={styles.messageTitle}>{isPositive ? "Well Rested!" : "Room for Growth"}</Text>
                    <Text style={styles.messageBody}>{message}</Text>
                </Animated.View>

                {/* Audio Events Section */}
                {events.length > 0 && (
                    <Animated.View entering={FadeInUp.delay(700)} style={styles.eventsContainer}>
                        <Text style={styles.sectionTitle}>Detected Events ({events.length})</Text>
                        {events.map((event, index) => (
                            <View key={index} style={styles.eventItem}>
                                <IconSymbol
                                    name={event.status === 'Emergency' ? 'exclamationmark.triangle.fill' : 'mic.fill'}
                                    size={20}
                                    color={event.status === 'Emergency' ? '#ef4444' : '#fbbf24'}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.eventTime}>{event.time}</Text>
                                    <Text style={styles.eventDesc}>{event.description}</Text>
                                </View>
                            </View>
                        ))}
                    </Animated.View>
                )}

                <Animated.View entering={FadeInUp.delay(800)} style={styles.statsGrid}>
                    {/* Placeholder stats since backend only gives score for now */}
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Duration</Text>
                        <Text style={styles.statValue}>{sleepDuration}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Events</Text>
                        <Text style={styles.statValue}>{events.length}</Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(1000)} style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </Animated.View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1B2A',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0D1B2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#9BA9CE',
        marginTop: 16,
        fontSize: 16,
    },
    content: {
        flexGrow: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 40, // Ensure space at bottom
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    date: {
        color: '#9BA9CE',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    title: {
        color: '#E0E6F5',
        fontSize: 32,
        fontWeight: '700',
    },
    scoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40,
    },
    ring: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 8,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    totalScore: {
        fontSize: 64,
        fontWeight: '800',
        color: '#3b82f6',
    },
    totalLabel: {
        fontSize: 14,
        color: '#9BA9CE',
        marginTop: 4,
    },
    changeBadge: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    changeText: {
        fontSize: 20,
        fontWeight: '700',
    },
    messageContainer: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        width: '100%',
        marginBottom: 24,
    },
    messageTitle: {
        color: '#E0E6F5',
        fontSize: 20,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 8,
    },
    messageBody: {
        color: '#9BA9CE',
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
    },
    statsGrid: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        marginBottom: 40,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        color: '#9BA9CE',
        fontSize: 14,
        marginBottom: 4,
    },
    statValue: {
        color: '#E0E6F5',
        fontSize: 20,
        fontWeight: '600',
    },
    footer: {
        width: '100%',
    },
    button: {
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 18,
        marginBottom: 20,
    },
    eventsContainer: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#E0E6F5',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    eventItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    eventTime: {
        color: '#9BA9CE',
        fontSize: 12,
        marginBottom: 4,
    },
    eventDesc: {
        color: '#E0E6F5',
        fontSize: 14,
        lineHeight: 20,
    },
});
