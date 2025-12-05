import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsSettingsScreen() {
    const router = useRouter();
    const [sleepReminders, setSleepReminders] = useState(true);
    const [wakeUpAlarms, setWakeUpAlarms] = useState(true);
    const [smartWakeUp, setSmartWakeUp] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(true);
    const [soundEvents, setSoundEvents] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color="#E0E6F5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sleep Schedule</Text>

                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Sleep Reminders</Text>
                            <Text style={styles.subLabel}>Get notified when it's time to wind down</Text>
                        </View>
                        <Switch
                            value={sleepReminders}
                            onValueChange={setSleepReminders}
                            trackColor={{ false: '#3e3e3e', true: '#3b82f6' }}
                            thumbColor={'#fff'}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Wake Up Alarm</Text>
                            <Text style={styles.subLabel}>Standard alarm notifications</Text>
                        </View>
                        <Switch
                            value={wakeUpAlarms}
                            onValueChange={setWakeUpAlarms}
                            trackColor={{ false: '#3e3e3e', true: '#3b82f6' }}
                            thumbColor={'#fff'}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Smart Wake Up</Text>
                            <Text style={styles.subLabel}>Wake up gently during light sleep</Text>
                        </View>
                        <Switch
                            value={smartWakeUp}
                            onValueChange={setSmartWakeUp}
                            trackColor={{ false: '#3e3e3e', true: '#3b82f6' }}
                            thumbColor={'#fff'}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Insights & Reports</Text>

                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Weekly Report</Text>
                            <Text style={styles.subLabel}>Summary of your sleep quality</Text>
                        </View>
                        <Switch
                            value={weeklyReport}
                            onValueChange={setWeeklyReport}
                            trackColor={{ false: '#3e3e3e', true: '#3b82f6' }}
                            thumbColor={'#fff'}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>Sound Event Alerts</Text>
                            <Text style={styles.subLabel}>Notify if loud noises are detected</Text>
                        </View>
                        <Switch
                            value={soundEvents}
                            onValueChange={setSoundEvents}
                            trackColor={{ false: '#3e3e3e', true: '#3b82f6' }}
                            thumbColor={'#fff'}
                        />
                    </View>
                </View>
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
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9BA9CE',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    labelContainer: {
        flex: 1,
        paddingRight: 16,
    },
    label: {
        fontSize: 16,
        color: '#E0E6F5',
        marginBottom: 4,
    },
    subLabel: {
        fontSize: 14,
        color: '#9BA9CE',
    },
});
