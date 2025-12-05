import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Toast from 'react-native-toast-message';

const BACKEND_URL = 'http://192.168.5.146:8000';

export default function EventsHistoryScreen() {
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/audio-events`);
            if (response.ok) {
                const data = await response.json();
                // Reverse to show newest first
                setEvents(data.reverse());
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = async () => {
        try {
            await fetch(`${BACKEND_URL}/audio-events`, { method: 'DELETE' });
            setEvents([]);
            Toast.show({
                type: 'success',
                text1: 'History Cleared',
                text2: 'Your event history has been reset.',
            });
        } catch (error) {
            console.error("Failed to clear history", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color="#E0E6F5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Event History</Text>
                <TouchableOpacity onPress={handleClearHistory} style={styles.backButton}>
                    <IconSymbol name="trash.fill" size={24} color="#ef4444" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.subtitle}>Last 7 Nights</Text>

                    {events.length === 0 ? (
                        <View style={styles.emptyState}>
                            <IconSymbol name="checkmark.shield.fill" size={64} color="#10b981" />
                            <Text style={styles.emptyText}>No warnings detected.</Text>
                            <Text style={styles.emptySubText}>You've had a peaceful week!</Text>
                        </View>
                    ) : (
                        events.map((event, index) => (
                            <View key={index} style={styles.eventCard}>
                                <View style={[
                                    styles.iconContainer,
                                    { backgroundColor: event.status === 'Emergency' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 191, 36, 0.1)' }
                                ]}>
                                    <IconSymbol
                                        name={event.status === 'Emergency' ? 'exclamationmark.triangle.fill' : 'mic.fill'}
                                        size={24}
                                        color={event.status === 'Emergency' ? '#ef4444' : '#fbbf24'}
                                    />
                                </View>
                                <View style={styles.eventInfo}>
                                    <View style={styles.eventHeader}>
                                        <Text style={[
                                            styles.eventStatus,
                                            { color: event.status === 'Emergency' ? '#ef4444' : '#fbbf24' }
                                        ]}>
                                            {event.status.toUpperCase()}
                                        </Text>
                                        <Text style={styles.eventTime}>{event.time}</Text>
                                    </View>
                                    <Text style={styles.eventDesc}>{event.description}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1B2A',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E0E6F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 24,
    },
    subtitle: {
        color: '#9BA9CE',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
    },
    eventCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eventInfo: {
        flex: 1,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    eventStatus: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    eventTime: {
        color: '#9BA9CE',
        fontSize: 12,
    },
    eventDesc: {
        color: '#E0E6F5',
        fontSize: 14,
        lineHeight: 20,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        color: '#E0E6F5',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 8,
    },
    emptySubText: {
        color: '#9BA9CE',
        fontSize: 16,
    },
});
