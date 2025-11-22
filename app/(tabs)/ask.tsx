import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { queryAI } from '@/services/api';
import Toast from 'react-native-toast-message';

export default function AskScreen() {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
        { role: 'assistant', text: 'Hello! I am your RestIQ sleep assistant. How can I help you improve your sleep today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        // Auto-scroll to bottom when messages change
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const handleSend = async () => {
        if (!question.trim() || isLoading) return;

        const userMsg = question;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setQuestion('');
        setIsLoading(true);

        try {
            const response = await queryAI({
                transcript: userMsg,
                // You can optionally include sensor data here in the future
                // sensorChunk: [],
                // sessionId: 'some-session-id',
            });

            if (response.ok && response.analysis) {
                // Format the AI response nicely
                const formattedResponse = `
📊 **Summary:** ${response.analysis.summary}

🏃 **Activity:** ${response.analysis.activity_guess}

💊 **Health Note:** ${response.analysis.health_note}

💡 **Recommendation:** ${response.analysis.recommendation}
                `.trim();

                setMessages(prev => [...prev, { role: 'assistant', text: formattedResponse }]);
            } else {
                throw new Error(response.error || 'Failed to get AI response');
            }
        } catch (error: any) {
            console.error('AI Query Error:', error);
            Toast.show({
                type: 'error',
                text1: 'AI Error',
                text2: error.message || 'Failed to connect to AI service',
            });
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: 'Sorry, I encountered an error. Please make sure the backend is running and try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Ask RestIQ</Text>
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
            >
                {messages.map((msg, index) => (
                    <View
                        key={index}
                        style={[
                            styles.messageBubble,
                            msg.role === 'user' ? styles.userBubble : styles.assistantBubble
                        ]}
                    >
                        <Text style={styles.messageText}>{msg.text}</Text>
                    </View>
                ))}
                {isLoading && (
                    <View style={[styles.messageBubble, styles.assistantBubble]}>
                        <ActivityIndicator color="#3b82f6" />
                        <Text style={[styles.messageText, { marginTop: 8 }]}>Thinking...</Text>
                    </View>
                )}
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ask about your sleep..."
                        placeholderTextColor="#9BA9CE"
                        value={question}
                        onChangeText={setQuestion}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={isLoading}
                    >
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
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
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E0E6F5',
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 20,
        gap: 16,
    },
    messageBubble: {
        padding: 16,
        borderRadius: 16,
        maxWidth: '80%',
    },
    userBubble: {
        backgroundColor: '#3b82f6',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    assistantBubble: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        color: '#E0E6F5',
        fontSize: 16,
        lineHeight: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        backgroundColor: '#0D1B2A',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 12,
        color: '#E0E6F5',
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 24,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#1e3a5f',
        opacity: 0.5,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
