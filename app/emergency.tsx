import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmergencyScreen() {
    const router = useRouter();
    const [contacting, setContacting] = useState(true);

    const handleCancel = () => {
        setContacting(false);
        router.back();
    };

    const handleCall = () => {
        Linking.openURL('tel:911');
    };

    const scale = useSharedValue(1);
    useEffect(() => {
        scale.value = withRepeat(withTiming(1.2, { duration: 1000 }), -1, true);
    }, []);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Animated.View entering={FadeIn} style={[styles.iconContainer, animatedStyle]}>
                    <IconSymbol name="exclamationmark.triangle.fill" size={80} color="#ef4444" />
                </Animated.View>

                <Text style={styles.title}>Emergency Detected</Text>
                <Text style={styles.subtitle}>
                    Distress sounds were detected. Contacting emergency services...
                </Text>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                        <Text style={styles.callButtonText}>Call 911 Now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                        <Text style={styles.cancelButtonText}>I'm Safe (Dismiss)</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a0505', // Dark red background
        justifyContent: 'center',
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 32,
        padding: 20,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderRadius: 100,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#ef4444',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#fee2e2',
        textAlign: 'center',
        marginBottom: 48,
        lineHeight: 26,
    },
    actions: {
        width: '100%',
        gap: 16,
    },
    callButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    callButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
    },
    cancelButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#9ca3af',
        fontSize: 16,
        fontWeight: '600',
    },
});
