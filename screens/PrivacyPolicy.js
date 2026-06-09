import React from 'react';
import { ScrollView, Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicy() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {/* Main Privacy Content */}
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Privacy Policy</Text>
                <Text style={styles.paragraph}>
                    Your privacy is important to us. This policy explains how OncoTrack collects, uses, and protects your information.
                </Text>

                <Text style={styles.subHeader}>1. Data Collection</Text>
                <Text style={styles.paragraph}>
                    We collect personal data such as your name, email, health logs, and reminders to support your treatment journey.
                </Text>

                <Text style={styles.subHeader}>2. Data Usage</Text>
                <Text style={styles.paragraph}>
                    Your data is used to personalize the app experience and provide insights. We do not sell your information to third parties.
                </Text>

                <Text style={styles.subHeader}>3. Data Storage</Text>
                <Text style={styles.paragraph}>
                    Data is securely stored in Firebase Firestore. Access is restricted to you and authorized support personnel.
                </Text>

                <Text style={styles.subHeader}>4. User Rights</Text>
                <Text style={styles.paragraph}>
                    You have the right to access, update, or delete your data. Contact us at support@oncotrack.app for assistance.
                </Text>

                <Text style={styles.subHeader}>5. GDPR & DPA Compliance</Text>
                <Text style={styles.paragraph}>
                    We comply with the General Data Protection Regulation (GDPR) and UK Data Protection Act (DPA) 2018.
                </Text>

                <Text style={styles.subHeader}>6. Contact Us</Text>
                <Text style={styles.paragraph}>
                    For privacy concerns, reach out to support@oncotrack.app.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backButton: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    paragraph: {
        fontSize: 16,
        marginTop: 10,
        lineHeight: 24,
    },
});