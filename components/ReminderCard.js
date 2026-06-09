import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReminderCard({
    IconComponent,
    label,
    time,
    completed,
    onToggleCompleted,
    onPress,
}) {
    // Determine if the reminder is missed
    const now = new Date();
    let missed = false;
    if (time) {
        const [reminderHour, reminderMinute] = time.split(':').map(Number);
        const reminderDate = new Date();
        reminderDate.setHours(reminderHour, reminderMinute, 0, 0);
        missed = now > reminderDate;
    }

    return (
        <View style={styles.container}>
            {/* Top Section: Checkbox and Time */}
            <View style={styles.topSection}>
                <TouchableOpacity
                    onPress={onToggleCompleted}
                    style={[
                        styles.checkbox,
                        completed
                            ? styles.checkboxCompleted
                            : !completed && missed && styles.checkboxMissed,
                    ]}
                >
                    {completed ? (
                        <Ionicons name="checkmark" size={20} color="#fff" />
                    ) : !completed && missed ? (
                        <Ionicons name="close" size={20} color="#fff" />
                    ) : null}
                </TouchableOpacity>
                <Text style={styles.topTime}>{time}</Text>
            </View>

            <View style={styles.separator} />

            {/* Bottom Section: Icon, Title, and Arrow */}
            <View style={styles.bottomSection}>
                {/* Left: Icon */}
                <View style={styles.leftPart}>
                    {IconComponent && (
                        <IconComponent
                            width={34}
                            height={34}
                            fill="#000"
                            style={styles.icon}
                        />
                    )}
                </View>
                {/* Reminder Title */}
                <View style={styles.centerPart}>
                    <Text style={styles.label}>{label}</Text>
                </View>
                {/* Navigation Arrow */}
                <TouchableOpacity style={styles.arrowButton} onPress={onPress}>
                    <Ionicons name="chevron-forward" size={24} color="#8A56AC" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 8,
        minHeight: 120,
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    topSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    checkboxCompleted: {
        backgroundColor: '#8A56AC',
        borderColor: '#8A56AC',
    },
    checkboxMissed: {
        backgroundColor: '#d32f2f',
        borderColor: '#d32f2f',
    },
    topTime: {
        fontSize: 16,
        color: '#000',
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 4,
    },
    bottomSection: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftPart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    centerPart: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowButton: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 10,
    },
    label: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});