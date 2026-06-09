import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db, auth } from '../firebaseConfig';
import { doc, collection, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export default function SymptomDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { symptom } = route.params;

    const [severity, setSeverity] = useState('');
    const [notes, setNotes] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({
            title: `Report ${symptom.name}`,
            headerTitleStyle: { fontWeight: 'bold' }
        });
    }, [navigation, symptom]);

    const handleSubmit = async () => {
        if (!severity) {
            Alert.alert('Error', 'Please select a severity.');
            return;
        }

        const record = {
            id: Date.now().toString(),
            symptom: symptom.name,
            severity,
            notes,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString(),
        };

        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            const symptomsRef = collection(userRef, "symptoms");
            const today = new Date().toLocaleDateString('en-CA');
            const dateDocRef = doc(symptomsRef, today);
            const docSnap = await getDoc(dateDocRef);

            if (docSnap.exists()) {
                await updateDoc(dateDocRef, {
                    symptoms: arrayUnion(record),
                });
            } else {
                await setDoc(dateDocRef, { symptoms: [record] });
            }
            Alert.alert('Success', 'Symptom reported successfully!');
            navigation.navigate('TrackMain');
        } catch (error) {
            console.error("Error saving symptom report:", error);
            Alert.alert('Error', 'Failed to report symptom.');
        }
    };

    return (
        <View style={styles.container}>


            <View style={styles.severityContainer}>
                {['Mild', 'Moderate', 'Severe'].map(option => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.severityButton, severity === option && styles.severityButtonActive]}
                        onPress={() => setSeverity(option)}
                    >
                        <Text style={[styles.severityButtonText, severity === option && styles.severityButtonTextActive]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TextInput
                style={styles.input}
                placeholder="Enter any notes... (optional)"
                placeholderTextColor="#888"
                value={notes}
                onChangeText={setNotes}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Report</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, paddingBottom: 80, backgroundColor: '#FFF', justifyContent: 'flex-start' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    subtitle: { fontSize: 20, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
    label: { fontSize: 16, marginBottom: 20, fontWeight: 'bold' },
    severityContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    severityButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#8A56AC',
        borderRadius: 8,
        marginHorizontal: 5,
    },
    severityButtonActive: { backgroundColor: '#8A56AC' },
    severityButtonText: { fontSize: 16, color: '#8A56AC', fontWeight: 'bold' },
    severityButtonTextActive: { color: '#fff' },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingLeft: 15,
        marginTop: 20,
        backgroundColor: '#fff',
    },
    submitButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        height: 50,
        backgroundColor: '#8A56AC',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});