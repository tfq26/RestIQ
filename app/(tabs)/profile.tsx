import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/authContext';
import { useSleepMode } from '@/contexts/SleepModeContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
    const router = useRouter();
    const { user } = useAuth() || {};
    const { toggleSleepMode } = useSleepMode();
    const [name, setName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            // Get name from metadata (social login or custom set)
            const metadataName = user.user_metadata?.full_name || user.user_metadata?.name || '';
            setName(metadataName || 'Dillon Ngyuen');
        } else {
            setName('Dillon Ngyuen');
        }
    }, [user]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    const handleSaveProfile = async () => {
        if (!name.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Name cannot be empty',
            });
            return;
        }
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: name }
            });

            if (error) throw error;

            setIsEditing(false);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Profile updated successfully',
            });
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const email = user?.email || 'No Email';
    // Use the name for initials if available, otherwise email
    const displayName = name || 'User';
    const initialsSource = name || email;
    const initials = initialsSource.substring(0, 2).toUpperCase();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
                {!isEditing ? (
                    <TouchableOpacity onPress={() => setIsEditing(true)}>
                        <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleSaveProfile} disabled={loading}>
                        <Text style={styles.saveButton}>{loading ? 'Saving...' : 'Save'}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{initials}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            {isEditing ? (
                                <TextInput
                                    style={styles.nameInput}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter your name"
                                    placeholderTextColor="#9BA9CE"
                                    autoFocus
                                />
                            ) : (
                                <Text style={styles.name}>{displayName}</Text>
                            )}
                            <Text style={styles.email}>{email}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sleep Goals & History</Text>
                    <View style={styles.goalsContainer}>
                        <TouchableOpacity
                            style={styles.goalButton}
                            onPress={() => router.push('/sleep-goals')}
                        >
                            <IconSymbol name="moon.stars.fill" size={24} color="#3b82f6" />
                            <Text style={styles.goalButtonText}>Set Goals</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.goalButton}
                            onPress={() => router.push('/events-history')}
                        >
                            <IconSymbol name="clock.fill" size={24} color="#fbbf24" />
                            <Text style={styles.goalButtonText}>Events</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/notifications-settings')}
                    >
                        <Text style={styles.menuItemText}>Notifications</Text>
                        <IconSymbol name="chevron.right" size={20} color="#9BA9CE" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/profile/health-data')}
                    >
                        <Text style={styles.menuItemText}>Health Profile</Text>
                        <IconSymbol name="chevron.right" size={20} color="#9BA9CE" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/connected-devices')}
                    >
                        <Text style={styles.menuItemText}>Connected Devices</Text>
                        <IconSymbol name="chevron.right" size={20} color="#9BA9CE" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={toggleSleepMode}>
                        <Text style={styles.menuItemText}>Sleep Mode</Text>
                        <IconSymbol name="moon.fill" size={20} color="#9BA9CE" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1B2A',
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E0E6F5',
    },
    editButton: {
        color: '#3b82f6',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        color: '#10b981',
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        padding: 20,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E0E6F5',
        marginBottom: 4,
    },
    nameInput: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E0E6F5',
        borderBottomWidth: 1,
        borderBottomColor: '#3b82f6',
        paddingBottom: 4,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#9BA9CE',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#9BA9CE',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    menuItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 16,
        color: '#E0E6F5',
    },
    signOutButton: {
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.2)',
    },
    signOutText: {
        color: '#ff6b6b',
        fontWeight: 'bold',
        fontSize: 16,
    },
    goalsContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    goalButton: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        gap: 8,
    },
    goalButtonText: {
        color: '#E0E6F5',
        fontSize: 14,
        fontWeight: '600',
    },
});
