import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import StethoscopeIcon from '../assets/icons/stethoscope.svg';
import PillIcon from '../assets/icons/pill.svg';
import AppointmentCard from './AppointmentCard';
import { auth, db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

function generateNext5Days() {
    const result = [];
    const today = new Date();
    for (let i = -2; i <= 2; i++) {
        const dayDate = new Date(today);
        dayDate.setDate(dayDate.getDate() + i);
        const dayName = dayDate.toLocaleDateString('en-GB', { weekday: 'short' });
        const numericDate = dayDate.getDate();
        const monthName = dayDate.toLocaleDateString('en-GB', { month: 'short' });
        result.push({
            day: dayName,
            date: numericDate,
            month: monthName,
            isToday: i === 0,
        });
    }
    return result;
}

function parseTime(timeStr) {
    if (!timeStr) return 0;
    const [hh, mm] = timeStr.split(':').map(Number);
    return hh * 60 + (mm || 0);
}
// Calendar on homepage
export default function CalendarCard() {
    const [dates] = useState(() => generateNext5Days());
    const [selectedIndex, setSelectedIndex] = useState(2);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        let unsubscribe;

        const listenToReminders = () => {
            const user = auth.currentUser;
            if (!user) {
                console.log('No user found; cannot load reminders.');
                return;
            }

            const remindersRef = collection(db, 'users', user.uid, 'reminders');
            unsubscribe = onSnapshot(remindersRef, (snapshot) => {
                const fetched = [];
                snapshot.forEach((doc) => {
                    fetched.push({ id: doc.id, ...doc.data() });
                });
                setAppointments(fetched);
            });
        };

        listenToReminders();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const currentDay = dates[selectedIndex]?.date;
    const filtered = appointments.filter((item) => item.day === currentDay);
    const sortedAppointments = [...filtered].sort((a, b) => {
        return parseTime(a.time) - parseTime(b.time);
    });

    const getIconForType = (type) =>
        type === 'Medication' ? PillIcon : StethoscopeIcon;

    return (
        <View style={styles.cardContainer}>
            {/* Date Row */}
            <View style={styles.dateRow}>
                {dates.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    const textStyle = index <= 2 ? styles.boldText : styles.lighterText;
                    return (
                        <TouchableOpacity
                            key={`${item.day}-${item.date}`}
                            onPress={() => setSelectedIndex(index)}
                            style={styles.dateItemContainer}
                        >
                            <View
                                style={[
                                    styles.dateItem,
                                    isSelected && styles.selectedDateBox,
                                ]}
                            >
                                <Text style={[styles.dateTextDay, textStyle]}>
                                    {item.day}
                                </Text>
                                <Text style={[styles.dateTextNumeric, textStyle]}>
                                    {item.date}
                                </Text>
                                <Text style={[styles.dateTextMonth, textStyle, { fontWeight: 'normal' }]}>
                                    {item.month}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Reminders for the selected day */}
            <View style={styles.appointmentList}>
                {sortedAppointments.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: '#888', marginVertical: 10 }}>
                        No reminders for this day
                    </Text>
                ) : (
                    sortedAppointments.map((item) => {
                        const IconComponent = getIconForType(item.type);
                        const labelText = item.dosage
                            ? `${item.name} - ${item.dosage}`
                            : item.name;
                        return (
                            <AppointmentCard
                                key={item.id}
                                IconComponent={IconComponent}
                                label={labelText}
                                time={item.time}
                            />
                        );
                    })
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 10,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    dateItemContainer: {
        marginHorizontal: 4,
    },
    dateItem: {
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        alignItems: 'center',
    },
    selectedDateBox: {
        backgroundColor: '#F3EEF6',
        borderWidth: 1,
        borderColor: '#e1d4ea',
    },
    dateTextDay: {
        fontSize: 14,
    },
    dateTextNumeric: {
        fontSize: 20,
    },
    dateTextMonth: {
        fontSize: 12,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#000',
    },
    lighterText: {
        fontWeight: 'normal',
        color: '#A0A0A0',
    },
    appointmentList: {
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
});