import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import LottieView from 'lottie-react-native';

export default function SignUpOptionsScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [emailError, setEmailError] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);

    // Validate email format
    const validateEmail = (input) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
        setIsEmailValid(isValid);
        setEmailError(isValid ? '' : 'Please enter a valid email address.');
        return isValid;
    };

    // Handle pressing Next after email input
    const handleEmailNext = async () => {
        setEmailTouched(true);
        const formattedEmail = email.trim().toLowerCase();
        if (!validateEmail(formattedEmail)) {
            return;
        }
        try {
            // Query Firestore for a user with this email
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', formattedEmail));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                navigation.navigate('LoginScreen', { email: formattedEmail });
            } else {
                navigation.navigate('EmailSignUpScreen', { email: formattedEmail });
            }
        } catch (error) {
            console.error("Error checking email existence:", error);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.welcome}>Welcome to</Text>
                    <Text style={styles.appName}>OncoTrack</Text>
                    <Text style={styles.tagline}>Your new personal health assistant</Text>
                </View>
                <Text style={styles.instruction}>Enter your email to sign up or log in</Text>

                <TextInput
                    style={[styles.input, emailTouched && !isEmailValid && styles.inputError]}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={text => {
                        setEmail(text);
                        if (emailTouched) {
                            validateEmail(text);
                        }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {emailTouched && !isEmailValid && <Text style={styles.errorText}>{emailError}</Text>}
                <TouchableOpacity style={styles.nextButton} onPress={handleEmailNext}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>

                {/* Background Animation */}
                <LottieView
                    source={require('../assets/animations/wavey.json')}
                    autoPlay
                    loop
                    speed={2.0}
                    style={styles.lottie}
                />
            </View>
        </TouchableWithoutFeedback>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3EEF6',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 80,
    },
    header: {
        position: 'absolute',
        top: 100,
        left: 20,
    },
    welcome: { fontSize: 36, fontWeight: 'bold', color: '#333', alignSelf: 'flex-start' },
    appName: { fontSize: 48, fontWeight: 'bold', color: '#333', alignSelf: 'flex-start' },
    tagline: { fontSize: 16, color: '#666', alignSelf: 'flex-start' },
    instruction: { fontSize: 18, marginBottom: 10, color: '#333' },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingLeft: 15,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    inputError: {
        borderColor: '#D9534F',
    },
    errorText: {
        color: '#D9534F',
        alignSelf: 'flex-start',
        marginBottom: 10,
        marginTop: -10,
    },
    nextButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#8A56AC',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    lottie: {
        position: 'absolute',
        bottom: -88,
        left: 0,
        width: 400,
        height: 400,
        zIndex: -1,
    },
});
