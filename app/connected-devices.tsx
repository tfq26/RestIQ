import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConnectedDevicesScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color="#E0E6F5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Connected Devices</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Active Devices</Text>

                <View style={styles.deviceCard}>
                    <View style={styles.iconContainer}>
                        <IconSymbol name="applewatch" size={32} color="#fff" />
                    </View>
                    <View style={styles.deviceInfo}>
                        <Text style={styles.deviceName}>Dillon's Apple Watch</Text>
                        <Text style={styles.deviceStatus}>Connected • Battery 82%</Text>
                    </View>
                    <View style={styles.statusIndicator} />
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Available Devices</Text>

                <TouchableOpacity style={styles.addDeviceButton}>
                    <View style={styles.addIconContainer}>
                        <IconSymbol name="plus" size={24} color="#9BA9CE" />
                    </View>
                    <Text style={styles.addDeviceText}>Pair New Device</Text>
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
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9BA9CE',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    deviceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    deviceInfo: {
        flex: 1,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E0E6F5',
        marginBottom: 4,
    },
    deviceStatus: {
        fontSize: 14,
        color: '#10b981',
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10b981',
        marginLeft: 12,
    },
    addDeviceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderStyle: 'dashed',
    },
    addIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    addDeviceText: {
        fontSize: 16,
        color: '#9BA9CE',
        fontWeight: '500',
    },
});
