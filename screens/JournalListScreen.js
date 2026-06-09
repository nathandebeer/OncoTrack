import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export default function JournalListScreen({ navigation }) {
    const [entries, setEntries] = useState([]);

    // Fetch journal entries from Firestore
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(collection(db, 'users', user.uid, 'journal'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, snapshot => {
            setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            {entries.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        No journal entries yet. Tap the + button to add one.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={entries}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('ViewJournalEntry', { entry: item })}>
                            <View style={styles.entryCard}>
                                <Text style={styles.entryTitle}>{item.title}</Text>
                                <Text numberOfLines={2} style={styles.entryContent}>
                                    {item.content}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
            {/* Floating Action Button to add new journal entry */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddJournalEntry')}
            >
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
    entryCard: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    entryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    entryContent: {
        fontSize: 15,
        color: '#444',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#8A56AC',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',

    },
});