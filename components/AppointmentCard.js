import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Reminder card for homepage calendar
export default function AppointmentCard({ IconComponent, label, time, borderColor }) {
    return (
        <View style={[styles.container, { borderColor: borderColor || '#e0e0e0' }]}>
            {IconComponent && <IconComponent width={24} height={24} fill="#000" style={styles.icon} />}
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.time}>{time}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    icon: {
        marginRight: 10,
    },
    label: {
        textAlign: 'center',
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    time: {
        fontSize: 14,
        color: '#777',
    },
});