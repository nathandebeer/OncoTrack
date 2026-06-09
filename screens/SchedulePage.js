import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import StethoscopeIcon from '../assets/icons/stethoscope.svg';
import PillIcon from '../assets/icons/pill.svg';
import ReminderCard from '../components/ReminderCard';
import { collection, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import * as Notifications from 'expo-notifications';
import { requestNotificationPermissions } from '../utils/notifications';
import CalendarComponent from '../components/CalendarComponent';


/**
 * Convert a time string into integer minutes.
 */
function parseTime(timeStr) {
    if (!timeStr) return 0;
    const [hh, mm] = timeStr.split(':').map(Number);
    return hh * 60 + (mm || 0);
}

export default function SchedulePage({ navigation, route }) {
    const [selectedIndex, setSelectedIndex] = useState(2); // Today by default
    const [appointments, setAppointments] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [entryType, setEntryType] = useState('Appointment');
    const [entryName, setEntryName] = useState('');
    const [entryDosage, setEntryDosage] = useState('');
    const [selectedTimes, setSelectedTimes] = useState([new Date()]);
    const [entryFrequency, setEntryFrequency] = useState('1');
    const [showTimePicker, setShowTimePicker] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

    // Listen for reminders from Firestore.
    useEffect(() => {
        if (!auth.currentUser) return;

        const remindersRef = collection(db, 'users', auth.currentUser.uid, 'reminders');
        const unsubscribe = onSnapshot(remindersRef, (snapshot) => {
            const fetched = [];
            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                if (data.id) {
                    delete data.id;
                }
                fetched.push({ id: docSnap.id, ...data });
            });
            setAppointments(fetched);
        });

        return () => unsubscribe();
    }, [auth.currentUser]);

    // Listen for new entries passed via route params
    useEffect(() => {
        if (route.params?.newEntry) {
            setAppointments((prev) => {
                if (!prev.some((item) => item.id === route.params.newEntry.id)) {
                    return [...prev, { ...route.params.newEntry, completed: false }];
                }
                return prev;
            });
            navigation.setParams({ newEntry: null });
        }
    }, [route.params?.newEntry]);

    // Add a new reminder to Firestore.
    const handleAddEntry = async () => {
        const user = auth.currentUser;
        if (!user) return;

        await requestNotificationPermissions();

        const reminders = [];

        const reminderDates =
            entryType === 'Appointment'
                ? [appointmentDate]
                : Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    return date;
                });

        for (let date of reminderDates) {
            const day = date.getDate();

            for (let time of selectedTimes) {
                const triggerDate = new Date(date);
                triggerDate.setHours(time.getHours(), time.getMinutes(), 0, 0);

                const notificationId = await Notifications.scheduleNotificationAsync({
                    content: {
                        title: entryType === 'Medication' ? 'Medication Reminder' : 'Appointment Reminder',
                        body: `${entryName}${entryDosage ? ` - ${entryDosage}` : ''}`,
                        sound: true,
                        priority: Notifications.AndroidNotificationPriority.HIGH,
                    },
                    trigger: triggerDate,
                });

                await addDoc(collection(db, 'users', user.uid, 'reminders'), {
                    type: entryType,
                    name: entryName,
                    day: triggerDate.getDate(),
                    month: triggerDate.getMonth(),
                    year: triggerDate.getFullYear(),
                    time: `${triggerDate.getHours().toString().padStart(2, '0')}:${triggerDate.getMinutes().toString().padStart(2, '0')}`,
                    dosage: entryType === 'Medication' ? entryDosage : '',
                    frequency: entryFrequency,
                    completed: false,
                    createdAt: new Date(),
                    notificationId,
                    scheduledDateTime: triggerDate.toISOString(),
                });
            }
        }

        try {
            for (let reminder of reminders) {
                await addDoc(collection(db, 'users', user.uid, 'reminders'), reminder);
            }
        } catch (err) {
            console.log('Error adding reminder to Firestore:', err);
        }

        // Reset state
        setEntryType('Appointment');
        setEntryName('');
        setEntryDosage('');
        setSelectedTimes([new Date()]);
        setEntryFrequency('1');
        setModalVisible(false);
    };

    // Helper to choose the proper icon.
    const getIconForType = (type) =>
        type === 'Medication' ? PillIcon : StethoscopeIcon;

    // Filter reminders for the selected day.
    const today = new Date();
    const dates = Array.from({ length: 5 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i - 2);
        return d;
    });
    const selectedDate = dates[selectedIndex];
    const filtered = appointments.filter((item) => {
        const sched = new Date(item.scheduledDateTime);
        return (
            sched.getDate() === selectedDate.getDate() &&
            sched.getMonth() === selectedDate.getMonth() &&
            sched.getFullYear() === selectedDate.getFullYear()
        );
    });
    const sortedAppointments = [...filtered].sort(
        (a, b) => parseTime(a.time) - parseTime(b.time)
    );

    // Toggle the "completed" field in Firebase when the checkbox is pressed.
    const handleToggleCompleted = async (reminder) => {
        const user = auth.currentUser;
        if (!user) return;
        try {
            await updateDoc(doc(db, 'users', user.uid, 'reminders', reminder.id), {
                completed: !reminder.completed,
            });
        } catch (err) {
            console.log('Error updating reminder:', err);
        }
    };

    // Time picker change handler.
    const onTimeChange = (event, selected) => {
        setShowTimePicker(false);
        if (event.type === 'dismissed') return;
        setSelectedTime(selected || new Date());
    };

    return (
        <View style={styles.container}>
            {/* Top Dates Row (5-day calendar) */}
            <CalendarComponent selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />

            {/* List of Reminders for the Selected Day */}
            {sortedAppointments.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Nothing on today</Text>
                </View>
            ) : (
                <FlatList
                    data={sortedAppointments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        const IconComponent = getIconForType(item.type);
                        const labelText = item.dosage ? `${item.name} - ${item.dosage}` : item.name;
                        const now = new Date();
                        const reminderDateTime = new Date(item.scheduledDateTime);
                        const isSameDay =
                            reminderDateTime.getDate() === now.getDate() &&
                            reminderDateTime.getMonth() === now.getMonth() &&
                            reminderDateTime.getFullYear() === now.getFullYear();
                        const isPastToday = isSameDay && now > reminderDateTime;
                        const showMissed = !item.completed && isPastToday;
                        const showCompleted = item.completed;
                        return (
                            <ReminderCard
                                IconComponent={IconComponent}
                                label={labelText}
                                time={item.time}
                                completed={showCompleted}
                                missed={showMissed}
                                onToggleCompleted={() => handleToggleCompleted(item)}
                                onPress={() => navigation.navigate('EditReminder', { reminder: item })}
                            />
                        );
                    }}
                />
            )}

            {/* Floating Action Button to Open the Modal */}
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Modal for Adding a New Entry */}
            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Entry</Text>
                        {/* Toggle between Appointment and Medication */}
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                onPress={() => setEntryType('Appointment')}
                                style={[styles.toggleButton, entryType === 'Appointment' && styles.toggleButtonActive]}
                            >
                                <Text style={[styles.toggleButtonText, entryType === 'Appointment' && styles.toggleButtonTextActive]}>
                                    Appointment
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setEntryType('Medication')}
                                style={[styles.toggleButton, entryType === 'Medication' && styles.toggleButtonActive]}
                            >
                                <Text style={[styles.toggleButtonText, entryType === 'Medication' && styles.toggleButtonTextActive]}>
                                    Medication
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#ccc"
                            placeholder={entryType === 'Medication' ? 'Medication Name' : 'Appointment Title'}
                            value={entryName}
                            onChangeText={setEntryName}
                        />
                        {entryType === 'Appointment' && (
                            <>
                                <TouchableOpacity
                                    style={styles.timePickerButton}
                                    onPress={() => setShowCustomDatePicker(true)}
                                >
                                    <Text style={styles.timePickerText}>
                                        {`Pick Date: ${appointmentDate.toLocaleDateString('en-GB')}`}
                                    </Text>
                                </TouchableOpacity>

                                {showCustomDatePicker && (
                                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                                        <DateTimePicker
                                            value={appointmentDate}
                                            mode="date"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={(event, selectedDate) => {
                                                setShowCustomDatePicker(false);
                                                if (event.type !== 'dismissed') {
                                                    setAppointmentDate(selectedDate || new Date());
                                                }
                                            }}
                                            textColor="#000"
                                        />
                                    </View>
                                )}
                            </>
                        )}
                        {entryType === 'Medication' && (
                            <>
                                <TextInput
                                    placeholderTextColor="#ccc"
                                    style={styles.input}
                                    placeholder="Dosage (e.g. 10mg)"
                                    value={entryDosage}
                                    onChangeText={setEntryDosage}
                                />
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Frequency per day</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        {['1', '2', '3'].map((option) => (
                                            <TouchableOpacity
                                                key={option}
                                                onPress={() => {
                                                    setEntryFrequency(option);
                                                    setSelectedTimes(Array.from({ length: parseInt(option) }, () => new Date()));
                                                }}
                                                style={{
                                                    flex: 1,
                                                    padding: 10,
                                                    backgroundColor: entryFrequency === option ? '#8A56AC' : '#eee',
                                                    borderRadius: 8,
                                                    marginHorizontal: 4,
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Text style={{ color: entryFrequency === option ? '#fff' : '#000' }}>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </>
                        )}
                        {selectedTimes.map((time, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.timePickerButton}
                                onPress={() => setShowTimePicker(index)}
                            >
                                <Text style={styles.timePickerText}>
                                    {`Pick Time ${index + 1}: ${time.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}`}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        {typeof showTimePicker === 'number' && (
                            <DateTimePicker
                                value={selectedTimes[showTimePicker]}
                                mode="time"
                                is24Hour
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                textColor='#000'
                                onChange={(event, selected) => {
                                    if (event.type !== 'dismissed') {
                                        const updated = [...selectedTimes];
                                        updated[showTimePicker] = selected || new Date();
                                        setSelectedTimes(updated);
                                    }
                                    setShowTimePicker(false);
                                }}
                            />
                        )}

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#aaa' }]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, { backgroundColor: '#8A56AC' }]} onPress={handleAddEntry}>
                                <Text style={styles.buttonText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: 'gray',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#8A56AC',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'center',
    },
    toggleButton: {
        backgroundColor: '#eee',
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 8,
    },
    toggleButtonActive: {
        backgroundColor: '#8A56AC',
    },
    toggleButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    toggleButtonTextActive: {
        color: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    timePickerButton: {
        backgroundColor: '#eee',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    timePickerText: {
        color: '#000',
        fontWeight: 'bold',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    button: {
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});