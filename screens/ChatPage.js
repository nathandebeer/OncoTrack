import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { askChatGPT } from '../utils/openaiAPI';

// Render a single message bubble
function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    return (
        <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{message.content}</Text>
        </View>
    );
}

export default function ChatScreen() {
    const [messages, setMessages] = useState([
        { id: 'init', role: 'system', content: 'Hello! I’m OncoAI, your AI Assistant. Ask me anything about symptoms, treatment, or medical concerns! (Disclaimer: I do not provide medical advice.)' },
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const flatListRef = useRef(null);

    const sendMessage = async () => {
        if (!inputText.trim()) return;
        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputText.trim(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setLoading(true);

        const botReply = await askChatGPT(userMessage.content);
        const botMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: botReply,
        };
        setMessages(prev => [...prev, botMessage]);
        setLoading(false);
    };

    // Scroll to the end of the chat when new messages are added
    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            {/* Messages list */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MessageBubble message={item} />}
                contentContainerStyle={styles.chatContainer}
            />
            {/* Loading spinner */}
            {loading && <ActivityIndicator size="small" color="#8A56AC" style={{ margin: 10 }} />}

            {/* Message input area */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={sendMessage}
                    returnKeyType="send"
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Ionicons name="send" size={24} color="#8A56AC" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    chatContainer: { padding: 10, paddingBottom: 80 },
    messageContainer: { padding: 10, borderRadius: 8, marginVertical: 5, maxWidth: '80%' },
    userMessage: { backgroundColor: '#e1d4ea', alignSelf: 'flex-end' },
    botMessage: { backgroundColor: '#d3d3d3', alignSelf: 'flex-start' },
    messageText: { color: '#000' },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15 },
    sendButton: { marginLeft: 10 },
});