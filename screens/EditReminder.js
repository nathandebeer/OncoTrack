import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../firebaseConfig';
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';

export default function EditReminder({ route, navigation }) {
    const { reminder } = route.params;
    const [name, setName] = useState(reminder.name);
    const [dosage, setDosage] = useState(reminder.dosage);
    const [time, setTime] = useState(reminder.time);

    // Update reminder and reschedule notification
    const handleUpdate = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;
            const reminderRef = doc(db, 'users', user.uid, 'reminders', reminder.id);

            // Cancel the old notification
            const oldNotificationId = reminder.notificationId;
            if (oldNotificationId) {
                await Notifications.cancelScheduledNotificationAsync(oldNotificationId);
            }

            // Schedule a new notification
            const [hours, minutes] = time.split(':').map(Number);
            const now = new Date();
            const scheduledTime = new Date(now);
            scheduledTime.setHours(hours);
            scheduledTime.setMinutes(minutes);
            scheduledTime.setSeconds(0);
            scheduledTime.setMilliseconds(0);

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: reminder.type === 'Medication' ? 'Medication Reminder' : 'Appointment Reminder',
                    body: `${name}${dosage ? ` - ${dosage}` : ''}`,
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                },
                trigger: scheduledTime,
            });
            // Update the reminder in Firestore
            await updateDoc(reminderRef, { name, dosage, time, notificationId });
            navigation.goBack();
        } catch (err) {
            console.error('Error updating reminder:', err);
        }
    };
    // Delete reminder and cancel notification
    const handleDelete = async () => {
        Alert.alert(
            'Delete Reminder',
            'Are you sure you want to delete this reminder?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const user = auth.currentUser;
                            if (!user) return;
                            const remindersRef = collection(db, 'users', user.uid, 'reminders');
                            const q = query(
                                remindersRef,
                                where('name', '==', reminder.name),
                                where('type', '==', reminder.type),
                                where('dosage', '==', reminder.dosage)
                            );
                            const snapshot = await getDocs(q);
                            snapshot.forEach(async (docSnap) => {
                                const data = docSnap.data();
                                if (data.notificationId) {
                                    await Notifications.cancelScheduledNotificationAsync(data.notificationId);
                                }
                                await deleteDoc(doc(db, 'users', user.uid, 'reminders', docSnap.id));
                            });
                            navigation.goBack();
                        } catch (err) {
                            console.error('Error deleting reminder:', err);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            {reminder.type === 'Medication' && (
                <TextInput
                    style={styles.input}
                    placeholder="Dosage"
                    value={dosage}
                    onChangeText={setDosage}
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="Time (HH:MM)"
                value={time}
                onChangeText={setTime}
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                <Text style={styles.buttonText}>Delete Reminder</Text>
            </TouchableOpacity>
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
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#8A56AC',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5,
    },
    deleteButton: {
        backgroundColor: '#d32f2f',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});