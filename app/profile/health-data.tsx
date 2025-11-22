import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuth } from '@/contexts/authContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Toast from 'react-native-toast-message';

export default function HealthDataScreen() {
    const router = useRouter();
    const { user } = useAuth() || {};
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        height: '',
        weight: '',
        age: '',
        sleepGoal: '',
        healthConditions: '',
        medications: '',
    });

    useEffect(() => {
        if (user?.user_metadata?.health_data) {
            setFormData(user.user_metadata.health_data);
        }
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    health_data: formData
                }
            });

            if (error) throw error;

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Health profile updated successfully',
            });
            router.back();
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

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color="#E0E6F5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Health Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.description}>
                        This information helps our AI provide more accurate sleep analysis and recommendations.
                    </Text>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Age</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.age}
                            onChangeText={(text) => updateField('age', text)}
                            placeholder="e.g. 28"
                            placeholderTextColor="#9BA9CE"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Height (cm)</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.height}
                                onChangeText={(text) => updateField('height', text)}
                                placeholder="e.g. 175"
                                placeholderTextColor="#9BA9CE"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Weight (kg)</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.weight}
                                onChangeText={(text) => updateField('weight', text)}
                                placeholder="e.g. 70"
                                placeholderTextColor="#9BA9CE"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Sleep Goal (hours)</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.sleepGoal}
                            onChangeText={(text) => updateField('sleepGoal', text)}
                            placeholder="e.g. 8"
                            placeholderTextColor="#9BA9CE"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Existing Health Conditions</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.healthConditions}
                            onChangeText={(text) => updateField('healthConditions', text)}
                            placeholder="e.g. Insomnia, Sleep Apnea, Asthma..."
                            placeholderTextColor="#9BA9CE"
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Current Medications</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.medications}
                            onChangeText={(text) => updateField('medications', text)}
                            placeholder="List any medications that might affect sleep..."
                            placeholderTextColor="#9BA9CE"
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <Text style={styles.saveButtonText}>
                            {loading ? 'Saving...' : 'Save Health Profile'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
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
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E0E6F5',
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    description: {
        color: '#9BA9CE',
        fontSize: 14,
        marginBottom: 24,
        lineHeight: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#E0E6F5',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 16,
        color: 'white',
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#3b82f6',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
