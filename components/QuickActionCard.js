import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Quick action cards on homepage
export default function QuickActionCard({ icon, label }) {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={30} color={'#8A56AC'} />
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',

    },
    label: {
        marginTop: 5,
        fontSize: 12,
        textAlign: 'center',
        color: '#000',
    },
    fixedQuickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
});
