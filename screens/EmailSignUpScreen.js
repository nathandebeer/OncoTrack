import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { resetTo } from '../navigation/navigationRef';


export default function EmailSignUpScreen({ route, navigation }) {
    const [email, setEmail] = useState(route.params.email || '');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');

    const [nameError, setNameError] = useState(false);
    const [surnameError, setSurnameError] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordTouched, setPasswordTouched] = useState(false);

    const [hasUppercase, setHasUppercase] = useState(false);
    const [hasLowercase, setHasLowercase] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [hasSpecial, setHasSpecial] = useState(false);

    const validateEmail = (email) => {
        const emailValid = email.trim().toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        if (!emailValid) {
            setEmailError('Email is invalid');
            return false;
        } else {
            setEmailError('');
            return true;
        }
    };

    const validatePassword = (password) => {
        setHasUppercase(/[A-Z]/.test(password));
        setHasLowercase(/[a-z]/.test(password));
        setHasNumber(/\d/.test(password));
        setHasSpecial(/[$@!%*?&]/.test(password));

        const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
        if (!passwordValid) {
            setPasswordError('');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };

    const handleEmailSignUp = async () => {
        let valid = true;

        if (name.trim() === '') {
            setNameError(true);
            valid = false;
        } else {
            setNameError(false);
        }

        if (surname.trim() === '') {
            setSurnameError(true);
            valid = false;
        } else {
            setSurnameError(false);
        }

        const isEmailValid = validateEmail(email);
        if (!isEmailValid) {
            valid = false;
        }

        setPasswordTouched(true);
        const isPasswordValid = validatePassword(password);
        if (!isPasswordValid) {
            valid = false;
        }

        if (!valid) {
            return;
        }

        try {
            const normalizedEmail = email.trim().toLowerCase();
            const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
            const user = userCredential.user;

            const userData = {
                firstName: name.trim(),
                lastName: surname.trim(),
                email: normalizedEmail,
                createdAt: Date.now(),
            };

            await updateProfile(user, { displayName: name.trim() });
            await setDoc(doc(db, 'users', user.uid), userData);
            resetTo('MainApp');
        } catch (error) {
            console.error('Sign Up Error', error.message);
        }
    };

    const isPasswordFullyValid = hasUppercase && hasLowercase && hasNumber && hasSpecial;

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.title}>Complete Your Sign-Up</Text>

            {/* Name Field */}
            <TextInput
                style={[styles.input, nameError ? styles.invalidInput : null]}
                placeholder="Firstname"
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    setNameError(text.trim() === '');
                }}
            />

            {/* Surname Field */}
            <TextInput
                style={[styles.input, surnameError ? styles.invalidInput : null]}
                placeholder="Surname"
                value={surname}
                onChangeText={(text) => {
                    setSurname(text);
                    setSurnameError(text.trim() === '');
                }}
            />

            {/* Email Field */}
            <TextInput
                style={[styles.input, emailError ? styles.invalidInput : null]}
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    validateEmail(text);
                }}
                placeholder="Email Address"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            {/* Password Field */}
            <TextInput
                style={[styles.input, passwordError ? styles.invalidInput : null]}
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={(text) => {
                    setPassword(text);
                    validatePassword(text);
                }}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            {/* Password Requirement Message */}
            <Text style={[styles.requirementText, passwordTouched && !isPasswordFullyValid ? styles.invalidRequirement : styles.validRequirement]}>
                Password must be at least 8 characters and should include:
            </Text>
            <Text style={[styles.requirementText, passwordTouched && !hasUppercase ? styles.invalidRequirement : styles.validRequirement]}>
                • 1 uppercase letter
            </Text>
            <Text style={[styles.requirementText, passwordTouched && !hasLowercase ? styles.invalidRequirement : styles.validRequirement]}>
                • 1 lowercase letter
            </Text>
            <Text style={[styles.requirementText, passwordTouched && !hasNumber ? styles.invalidRequirement : styles.validRequirement]}>
                • 1 number
            </Text>
            <Text style={[styles.requirementText, passwordTouched && !hasSpecial ? styles.invalidRequirement : styles.validRequirement]}>
                • 1 special character
            </Text>

            {/* Sign Up Button */}
            <TouchableOpacity style={styles.signUpButton} onPress={handleEmailSignUp}>
                <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.agreementText}>
                By signing up, you agree to our
                <Text style={styles.linkText} onPress={() => navigation.navigate('TermsAndConditions')}> Terms & Conditions</Text> and
                <Text style={styles.linkText} onPress={() => navigation.navigate('PrivacyPolicy')}> Privacy Policy</Text>.
            </Text>
        </View>
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
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
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
        fontSize: 12,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    requirementText: {
        fontSize: 12,
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
    validRequirement: {
        color: 'grey',
    },
    invalidRequirement: {
        color: '#D9534F',
    },
    signUpButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#8A56AC',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    signUpButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    agreementText: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',

    },
    linkText: {
        color: '#8A56AC',
        textDecorationLine: 'underline',
    },
});
