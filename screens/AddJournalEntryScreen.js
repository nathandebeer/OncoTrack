import React, { useState, useLayoutEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AddJournalEntryScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // Save new journal entry to Firestore
    const saveEntry = async () => {
        if (!title.trim()) {
            Alert.alert('Validation', 'Title cannot be empty.');
            return;
        }
        const user = auth.currentUser;
        if (!user) return;
        try {
            await addDoc(collection(db, 'users', user.uid, 'journal'), {
                title,
                content,
                createdAt: serverTimestamp(),
            });
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save entry.');
        }
    };

    // Add a save button to the header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 15, opacity: title.trim() ? 1 : 0.5 }}
                    onPress={saveEntry}
                    disabled={!title.trim()}
                >
                    <Text style={{ color: '#8A56AC', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
                </TouchableOpacity>
            ),

        });
    }, [navigation, title, content]);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.titleInput}
            />
            <TextInput
                placeholder="Write your thoughts..."
                value={content}
                onChangeText={setContent}
                style={styles.contentInput}
                multiline
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    titleInput: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 5,
    },
    contentInput: {
        flex: 1,
        fontSize: 16,
        textAlignVertical: 'top',
    },
});