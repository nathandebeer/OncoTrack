import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function SymptomReportsScreen() {
    const { reportedSymptoms } = useRoute().params;
    const [symptoms, setReportedSymptoms] = useState(reportedSymptoms);

    const handleDeleteSymptom = async (id) => {
        Alert.alert(
            "Delete Symptom",
            "Are you sure you want to delete this symptom record?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", onPress: async () => {
                        try {
                            const today = new Date().toISOString().split('T')[0];
                            const symptomToDelete = symptoms.find(symptom => symptom.id === id);

                            const userRef = doc(db, 'users', auth.currentUser.uid);
                            const symptomsDocRef = doc(userRef, 'symptoms', today);

                            await updateDoc(symptomsDocRef, {
                                symptoms: arrayRemove(symptomToDelete)
                            });

                            const updatedSymptoms = symptoms.filter(symptom => symptom.id !== id);
                            setReportedSymptoms(updatedSymptoms);
                        } catch (error) {
                            console.error("Error deleting symptom:", error);
                        }
                    }, style: "destructive"
                }
            ]
        );
    };

    const symptomIcons = {
        "Fatigue": "battery-dead",
        "Nausea": "alert-circle",
        "Pain": "medkit",
        "Loss of Appetite": "restaurant",
        "Dizziness": "warning",
        "Shortness of Breath": "speedometer",
        "Headache": "person",
        "Fever": "thermometer",
        "Insomnia": "bed",
        "Weight Loss": "body",
    };

    return (
        <View style={styles.container}>
            <View style={styles.reportedSectionContainer}>
                {symptoms.length === 0 ? (
                    <Text style={styles.emptyText}>Nothing reported for this day</Text>
                ) : (
                    <FlatList
                        data={symptoms}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.recordCard}>
                                <Ionicons
                                    name={symptomIcons[item.symptom] || "pulse"}
                                    size={24}
                                    color="#8A56AC"
                                    style={styles.symptomIcon}
                                />
                                <View style={styles.recordDetails}>
                                    <Text style={styles.recordText}>{item.description || item.symptom}</Text>
                                    <Text style={styles.recordInfo}>
                                        {item.time} | Severity: {item.severity}
                                    </Text>
                                </View>
                                <Ionicons
                                    name="trash-outline"
                                    size={24}
                                    color="grey"
                                    style={styles.deleteIcon}
                                    onPress={() => handleDeleteSymptom(item.id)}
                                />
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF', padding: 10 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    emptyText: { textAlign: 'center', color: '#888', fontSize: 16, marginVertical: 10 },
    reportedSectionContainer: {
        minHeight: 60,
        justifyContent: 'center',
        marginBottom: 20,
    },
    recordCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    symptomIcon: {
        marginRight: 10,
    },
    recordDetails: {
        flex: 1,
    },
    recordText: { fontSize: 16, fontWeight: 'bold' },
    recordInfo: { fontSize: 14, color: '#555' },
    deleteIcon: {
        marginLeft: 10,
    },
});