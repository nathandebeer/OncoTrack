import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export default function ViewJournalEntryScreen({ route, navigation }) {
    const { entry } = route.params;

    // Delete journal entry from Firestore
    const handleDelete = async () => {
        const user = auth.currentUser;
        if (!user) return;
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'journal', entry.id));
            Alert.alert('Deleted', 'Journal entry deleted.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to delete entry.');
        }
    };

    // Add a delete button to the header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleDelete} style={{ marginRight: 15 }}>
                    <Text style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: 16 }}>Delete</Text>
                </TouchableOpacity>
            ),
            title: 'Journal Entry',
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{entry.title}</Text>
            <Text style={styles.content}>{entry.content}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
});