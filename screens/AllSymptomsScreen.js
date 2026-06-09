import React, { useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Larger list of predefined symptoms
const allSymptoms = [
    { id: '1', name: 'Fatigue', icon: 'battery-dead' },
    { id: '2', name: 'Nausea', icon: 'alert-circle' },
    { id: '3', name: 'Pain', icon: 'medkit' },
    { id: '4', name: 'Loss of Appetite', icon: 'restaurant' },
    { id: '5', name: 'Dizziness', icon: 'warning' },
    { id: '6', name: 'Shortness of Breath', icon: 'speedometer' },
    { id: '7', name: 'Headache', icon: 'person' },
    { id: '8', name: 'Fever', icon: 'thermometer' },
    { id: '9', name: 'Insomnia', icon: 'bed' },
    { id: '10', name: 'Weight Loss', icon: 'body' },
];

// Adding an "Other" option to the list
const allSymptomsWithOther = [
    ...allSymptoms,
    { id: 'other', name: 'Other', icon: 'create' }
];

export default function AllSymptomsScreen() {
    const navigation = useNavigation();
    const [selectedSymptom, setSelectedSymptom] = useState(null);
    const [customSymptom, setCustomSymptom] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Select a Symptom to Report",
            headerTitleStyle: { fontWeight: 'bold' }
        });
    }, [navigation]);

    const handleSymptomSelect = (item) => {
        if (item.id === 'other') {
            setSelectedSymptom('other');
        } else {
            navigation.navigate('SymptomDetailScreen', { symptom: item });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <FlatList
                        data={allSymptomsWithOther}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.symptomItem} onPress={() => handleSymptomSelect(item)}>
                                <Ionicons name={item.icon} size={24} color="#8A56AC" style={styles.symptomIcon} />
                                <Text style={styles.symptomText}>{item.name}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#8A56AC" />
                            </TouchableOpacity>
                        )}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                    {selectedSymptom === 'other' && (
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your symptom"
                                placeholderTextColor="#888"
                                value={customSymptom}
                                onChangeText={setCustomSymptom}
                            />
                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={() => {
                                    if (customSymptom.trim().length > 0) {
                                        navigation.navigate('SymptomDetailScreen', { symptom: { id: 'custom', name: customSymptom } });
                                        setSelectedSymptom(null);
                                        setCustomSymptom('');
                                    } else {
                                        Alert.alert('Error', 'Please enter a symptom.');
                                    }
                                }}
                            >
                                <Text style={styles.nextButtonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF', padding: 10 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    symptomItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    symptomIcon: { marginRight: 10 },
    symptomText: { flex: 1, fontSize: 16 },
    inputWrapper: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        right: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingLeft: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    nextButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#8A56AC',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});