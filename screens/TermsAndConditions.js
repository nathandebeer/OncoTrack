import React from 'react';
import { ScrollView, Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function TermsAndConditions() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {/* Main Terms Content */}
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Terms and Conditions</Text>
                <Text style={styles.paragraph}>
                    Welcome to OncoTrack. By accessing or using our app, you agree to be bound by these Terms and Conditions.
                </Text>

                <Text style={styles.subHeader}>1. Use of the App</Text>
                <Text style={styles.paragraph}>
                    The app is designed to help cancer patients manage their treatment, symptoms, appointments, and access support. Use is at your own discretion and does not replace medical advice.
                </Text>

                <Text style={styles.subHeader}>2. User Responsibilities</Text>
                <Text style={styles.paragraph}>
                    You are responsible for keeping your login credentials secure. Any information you provide should be accurate and up-to-date.
                </Text>

                <Text style={styles.subHeader}>3. Data Usage</Text>
                <Text style={styles.paragraph}>
                    We use your data to provide personalized health tracking and support. Please refer to our Privacy Policy for more details.
                </Text>

                <Text style={styles.subHeader}>4. Modifications</Text>
                <Text style={styles.paragraph}>
                    We may update these Terms at any time. Continued use of the app implies acceptance of the updated Terms.
                </Text>

                <Text style={styles.subHeader}>5. Contact Us</Text>
                <Text style={styles.paragraph}>
                    If you have any questions, contact us at support@oncotrack.app.
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
        padding: 20,
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