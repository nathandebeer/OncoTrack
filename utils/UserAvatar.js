import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';

export default function UserAvatar() {
    const user = auth.currentUser;

    if (!user) {
        return (
            <View style={styles.letterAvatar}>
                <Text style={styles.letterAvatarText}>?</Text>
            </View>
        );
    }

    const displayName = user.displayName || 'Unknown';
    const firstLetter = displayName.charAt(0).toUpperCase();
    const photoURL = user.photoURL;

    if (photoURL) {
        // Show the user’s actual profile pic
        return <Image source={{ uri: photoURL }} style={styles.avatarImage} />;
    } else {
        // No photo: show a letter avatar
        return (
            <View style={styles.letterAvatar}>
                <Text style={styles.letterAvatarText}>{firstLetter}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    avatarImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 15,
    },
    letterAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#8A56AC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    letterAvatarText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});