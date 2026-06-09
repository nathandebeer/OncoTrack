import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Generates 5 days around today's date (2 before, 2 after).
function generateNext5Days() {
    const result = [];
    const today = new Date();
    for (let i = -2; i <= 2; i++) {
        const dayDate = new Date(today);
        dayDate.setDate(today.getDate() + i);
        const dayName = dayDate.toLocaleDateString('en-GB', { weekday: 'short' });
        const numericDate = dayDate.getDate();
        const monthName = dayDate.toLocaleDateString('en-GB', { month: 'short' });
        result.push({ day: dayName, date: numericDate, month: monthName });
    }
    return result;
}

// Small reusable horizontal calendar displaying 5 days. 
export default function CalendarComponent({ selectedIndex, setSelectedIndex }) {
    const [dates] = useState(() => generateNext5Days());

    return (
        <View style={styles.topDatesRow}>
            {dates.map((item, idx) => {
                const textStyle = idx <= 2 ? styles.boldText : styles.lighterText;
                return (
                    <TouchableOpacity
                        key={idx}
                        style={styles.dateItemContainer}
                        onPress={() => setSelectedIndex(idx)}
                    >
                        <View
                            style={[
                                styles.dateItem,
                                selectedIndex === idx && styles.selectedDateBox,
                            ]}
                        >
                            <Text style={[styles.dateTextDay, textStyle]}>{item.day}</Text>
                            <Text style={[styles.dateTextNumeric, textStyle]}>{item.date}</Text>
                            <Text style={[styles.dateTextMonth, textStyle, { fontWeight: 'normal' }]}>
                                {item.month}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    topDatesRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateItemContainer: {
        marginHorizontal: 4,
    },
    dateItem: {
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
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
});
