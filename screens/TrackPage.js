import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CalendarComponent from '../components/CalendarComponent';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { doc, collection, onSnapshot } from 'firebase/firestore';

// Predefined list of common symptoms
const dummyCommonSymptoms = [
    { id: '1', name: 'Fatigue', icon: 'battery-dead' },
    { id: '2', name: 'Nausea', icon: 'alert-circle' },
    { id: '3', name: 'Pain', icon: 'medkit' },
];

// CommonCard component to display a list of common symptoms
function CommonCard({ type, commonItems, onMorePress, onReportItem }) {
    return (
        <View style={styles.commonCard}>
            <View style={styles.commonHeader}>
                <Text style={styles.commonHeaderText}>{type}</Text>
                <TouchableOpacity style={styles.moreButton} onPress={onMorePress}>
                    <Text style={styles.moreText}>More Symptoms</Text>
                    <Ionicons name="chevron-forward" size={20} color="#8A56AC" />
                </TouchableOpacity>
            </View>
            <View style={styles.separatorLine} />
            <View style={styles.commonList}>
                {commonItems.map(item => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.smallCard}
                        onPress={() => onReportItem(item)}
                    >
                        <Ionicons name={item.icon} size={24} color="#8A56AC" style={styles.smallCardIcon} />
                        <Text style={styles.smallCardText}>{item.name}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#8A56AC" style={styles.smallCardArrow} />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

export default function TrackPage() {
    const navigation = useNavigation();
    const [selectedIndex, setSelectedIndex] = useState(2);
    const [symptomRecords, setSymptomRecords] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [recordDescription, setRecordDescription] = useState('');
    const [recordSeverity, setRecordSeverity] = useState('');

    // Generate the current and surrounding dates for the mini-calendar
    const generateNext5Dates = () => {
        const result = [];
        const today = new Date();
        for (let i = -2; i <= 2; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            result.push(d.toISOString().split('T')[0]);
        }
        return result;
    };
    const dates = generateNext5Dates();
    const selectedDate = dates[selectedIndex];

    // Listen for symptom records on the selected date
    useEffect(() => {
        let unsubscribe;

        const listenToSymptoms = () => {
            const user = auth.currentUser;
            if (!user) return;

            const userRef = doc(db, 'users', user.uid);
            const symptomsRef = collection(userRef, 'symptoms');
            const dateDocRef = doc(symptomsRef, selectedDate);

            unsubscribe = onSnapshot(dateDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    setSymptomRecords(docSnap.data().symptoms || []);
                } else {
                    setSymptomRecords([]);
                }
            });
        };

        listenToSymptoms();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [selectedDate]);

    // Handler to add a new record
    const handleAddRecord = () => {
        if (recordDescription.trim().length === 0) return;
        const newRecord = {
            id: Date.now().toString(),
            description: recordDescription,
            severity: recordSeverity,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: selectedDate,
        };
        setSymptomRecords(prev => [newRecord, ...prev]);
        setRecordDescription('');
        setRecordSeverity('');
        setModalVisible(false);
    };

    const handleMorePress = () => {
        navigation.navigate('AllSymptomsScreen');
    };

    const handleReportItem = (item) => {
        navigation.navigate('SymptomDetailScreen', { symptom: item });
    };

    return (
        <ScrollView style={styles.container}>
            {/* Calendar at the top */}
            <CalendarComponent selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />

            {/* Reported Section */}
            <View style={styles.reportedSectionContainer}>
                {symptomRecords.length === 0 ? (
                    <Text style={styles.emptyText}>Nothing reported for this day</Text>
                ) : (
                    <TouchableOpacity
                        style={styles.reportedCard}
                        onPress={() => navigation.navigate('SymptomReportsScreen', { reportedSymptoms: symptomRecords })}
                    >
                        <Ionicons name="clipboard-outline" size={24} color="#8A56AC" style={styles.reportedIcon} />
                        <Text style={styles.reportedText}>
                            {symptomRecords.length} Symptom{symptomRecords.length > 1 ? 's' : ''} Reported Today
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#8A56AC" style={styles.reportedArrow} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Common Symptom Card */}
            <CommonCard
                type="Symptoms"
                commonItems={dummyCommonSymptoms}
                onMorePress={handleMorePress}
                onReportItem={handleReportItem}
            />

            {/* Modal for Adding a New Record */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Add New Symptom
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={recordDescription}
                            onChangeText={setRecordDescription}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Severity (1-10)"
                            value={recordSeverity}
                            onChangeText={setRecordSeverity}
                            keyboardType="numeric"
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#8A56AC' }]}
                                onPress={handleAddRecord}
                            >
                                <Text style={styles.buttonText}>Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: '#aaa' }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 10,
    },
    reportedSectionContainer: {
        minHeight: 70,
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        marginVertical: 10,
    },
    recordCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    recordText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    recordInfo: {
        fontSize: 14,
        color: '#555',
    },
    commonCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    commonHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    commonHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    moreButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moreText: {
        fontSize: 14,
        color: '#8A56AC',
        marginRight: 4,
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 8,
    },
    commonList: {},
    smallCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    smallCardIcon: {
        marginRight: 10,
    },
    smallCardText: {
        flex: 1,
        fontSize: 16,
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
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
    reportedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',

    },
    reportedIcon: {
        marginRight: 10,
    },
    reportedText: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
    },
    reportedArrow: {},
});