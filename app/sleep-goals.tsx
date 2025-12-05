import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function SleepGoalsScreen() {
    const router = useRouter();
    const [dailyGoal, setDailyGoal] = useState('8');
    const [weeklyGoal, setWeeklyGoal] = useState('56');

    const handleSave = () => {
        // Save to local storage or backend
        // For now, just show a success toast and go back
        Toast.show({
            type: 'success',
            text1: 'Goals Saved',
            text2: 'Your sleep goals have been updated.',
        });
        setTimeout(() => router.back(), 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color="#E0E6F5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sleep Goals</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <IconSymbol name="moon.stars.fill" size={40} color="#3b82f6" />
                    </View>
                    <Text style={styles.cardTitle}>Daily Sleep Target</Text>
                    <Text style={styles.cardSubtitle}>How many hours do you want to sleep each night?</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={dailyGoal}
                            onChangeText={setDailyGoal}
                            keyboardType="numeric"
                            maxLength={2}
                        />
                        <Text style={styles.unit}>Hours</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(251, 191, 36, 0.1)' }]}>
                        <IconSymbol name="calendar" size={40} color="#fbbf24" />
                    </View>
                    <Text style={styles.cardTitle}>Weekly Sleep Target</Text>
                    <Text style={styles.cardSubtitle}>Total hours of sleep you aim for in a week.</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, { color: '#fbbf24', borderBottomColor: '#fbbf24' }]}
                            value={weeklyGoal}
                            onChangeText={setWeeklyGoal}
                            keyboardType="numeric"
                            maxLength={3}
                        />
                        <Text style={styles.unit}>Hours</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Goals</Text>
                </TouchableOpacity>
            </ScrollView>
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
    content: {
        padding: 24,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E0E6F5',
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#9BA9CE',
        textAlign: 'center',
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    input: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#3b82f6',
        borderBottomWidth: 2,
        borderBottomColor: '#3b82f6',
        minWidth: 80,
        textAlign: 'center',
        paddingBottom: 4,
    },
    unit: {
        fontSize: 20,
        color: '#9BA9CE',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#10b981',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
