import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';

export default function ToDoScreen() {
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);

    // Listen for tasks in Firestore
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const unsubscribe = onSnapshot(
            collection(db, 'users', user.uid, 'todos'),
            (snapshot) => {
                setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            }
        );

        return () => unsubscribe();
    }, []);

    const addTask = async () => {
        if (!task.trim()) return;
        const user = auth.currentUser;
        await addDoc(collection(db, 'users', user.uid, 'todos'), {
            text: task.trim(),
            completed: false,
        });
        setTask('');
    };

    const deleteTask = async (taskId) => {
        const user = auth.currentUser;
        await deleteDoc(doc(db, 'users', user.uid, 'todos', taskId));
    };

    const toggleComplete = async (task) => {
        const user = auth.currentUser;
        const docRef = doc(db, 'users', user.uid, 'todos', task.id);
        await updateDoc(docRef, {
            completed: !task.completed,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputRow}>
                <TextInput
                    placeholder="New Task"
                    style={styles.input}
                    value={task}
                    onChangeText={setTask}
                />
                <TouchableOpacity onPress={addTask} style={styles.addButton}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.taskRow}>
                        <TouchableOpacity onPress={() => toggleComplete(item)}>
                            <Ionicons
                                name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                                size={24}
                                color={item.completed ? '#4caf50' : '#ccc'}
                                style={{ marginRight: 10 }}
                            />
                        </TouchableOpacity>
                        <Text style={[styles.taskText, item.completed && styles.completedText]}>
                            {item.text}
                        </Text>
                        <TouchableOpacity onPress={() => deleteTask(item.id)}>
                            <Ionicons name="trash-outline" size={20} color="grey" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        paddingVertical: 8,
    },
    addButton: {
        backgroundColor: '#8A56AC',
        marginLeft: 10,
        padding: 10,
        borderRadius: 8,
    },
    taskRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    taskText: { fontSize: 16 },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
});