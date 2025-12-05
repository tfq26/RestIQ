import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { IconSymbol } from './ui/icon-symbol';

const { width, height } = Dimensions.get('window');

interface EmergencyScreenProps {
    visible: boolean;
    onDismiss: () => void;
}

export default function EmergencyScreen({ visible, onDismiss }: EmergencyScreenProps) {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: 300 });
            // Blaring light effect
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.2, { duration: 500, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
        } else {
            opacity.value = withTiming(0, { duration: 300 });
        }
    }, [visible]);

    const containerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        zIndex: visible ? 99999 : -1,
    }));

    const bgStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            <StatusBar hidden={true} />

            {/* Blaring Red Background */}
            <Animated.View style={[styles.background, bgStyle]} />

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <IconSymbol name="exclamationmark.triangle.fill" size={80} color="#fff" />
                </View>

                <Text style={styles.title}>CRITICAL ALERT</Text>
                <Text style={styles.subtitle}>Health Emergency Detected</Text>

                <View style={styles.statusContainer}>
                    <View style={styles.statusRow}>
                        <IconSymbol name="phone.fill" size={24} color="#fff" />
                        <Text style={styles.statusText}>Contacting Emergency Contacts...</Text>
                    </View>
                    <View style={styles.statusRow}>
                        <IconSymbol name="cross.fill" size={24} color="#fff" />
                        <Text style={styles.statusText}>Contacting Emergency Services...</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
                    <Text style={styles.dismissText}>Dismiss (Demo)</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#ef4444', // Red-500
        opacity: 0.8,
    },
    content: {
        alignItems: 'center',
        padding: 32,
        width: '100%',
    },
    iconContainer: {
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 10,
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 2,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 48,
        fontWeight: '600',
        opacity: 0.9,
    },
    statusContainer: {
        width: '100%',
        gap: 16,
        marginBottom: 48,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 16,
        borderRadius: 12,
        gap: 16,
    },
    statusText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    dismissButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    dismissText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
