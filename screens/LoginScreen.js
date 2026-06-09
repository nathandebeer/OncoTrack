import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { resetTo } from '../navigation/navigationRef';

export default function LoginScreen({ route, navigation }) {
    const { email } = route.params;
    const [password, setPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');

    // Validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Invalid email address");
        } else {
            setEmailError('');
        }
    };

    const handleLogin = async () => {
        if (password.trim() === '') {
            setIsPasswordValid(false);
            setPasswordError("Please enter a valid password");
            return;
        }
        setIsPasswordValid(true);
        setPasswordError('');

        try {
            const normalizedEmail = email.trim().toLowerCase();
            await signInWithEmailAndPassword(auth, normalizedEmail, password);
            resetTo('MainApp');
        } catch (error) {
            setIsPasswordValid(false);
            setPasswordError("Password is incorrect");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <Text style={styles.title}>Log In</Text>

                {/* Email Input */}
                <TextInput
                    style={styles.input}
                    value={email}
                    editable={true}
                    placeholder="Email Address"
                    onChangeText={(text) => {
                        validateEmail(text);
                    }}
                />
                {emailError !== '' && <Text style={styles.errorText}>{emailError}</Text>}

                {/* Password Input */}
                <TextInput
                    style={[styles.input, !isPasswordValid && styles.invalidInput]}
                    placeholder="Enter your password"
                    value={password}
                    secureTextEntry
                    onChangeText={setPassword}
                />
                {!isPasswordValid && <Text style={styles.errorText}>{passwordError}</Text>}

                {/* Login Button */}
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Log In</Text>
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
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingLeft: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    invalidInput: {
        borderColor: '#D9534F',
    },
    errorText: {
        color: '#D9534F',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#8A56AC',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
    },
    lottie: {
        position: 'absolute',
        bottom: -88,
        left: 0,
        width: 400,
        height: 400,
        zIndex: -1,
    },
});
