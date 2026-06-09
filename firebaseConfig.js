import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyC_vdWQS3_5rxtOqUUaamNxXa-62sOVM3M',
    authDomain: 'oncotrack-f29e4.firebaseapp.com',
    projectId: 'oncotrack-f29e4',
    storageBucket: 'oncotrack-f29e4.firebasestorage.app',
    messagingSenderId: '721064675340',
    appId: '1:721064675340:web:8c7a37c56522510ea74629',
    measurementId: 'G-2H1ZLJP20M',
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

// Initialize Firebase Auth using AsyncStorage persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export { db, auth };
export default app;
