import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserAvatar from '../utils/UserAvatar';
import { useNavigation } from '@react-navigation/native';
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { getTimeElapsed } from '../utils/timeUtils';

export default function CommunityPage() {
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);

    // Listen for posts collection
    useEffect(() => {
        let unsubscribe;

        const listenToPosts = () => {
            const user = auth.currentUser;
            if (!user) return;

            const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
            unsubscribe = onSnapshot(q, (snapshot) => {
                const postsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPosts(postsData);
            });
        };

        listenToPosts();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    // Function to handle like/unlike
    const handleLikePress = async (item) => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;
        const alreadyLiked = item.likedBy?.includes(userId);
        try {
            const postRef = doc(db, 'posts', item.id);
            if (alreadyLiked) {
                await updateDoc(postRef, {
                    likedBy: arrayRemove(userId),
                });
            } else {
                await updateDoc(postRef, {
                    likedBy: arrayUnion(userId),
                });
            }
        } catch (error) {
            console.error('Error updating likes: ', error);
        }
    };

    // Render a single post
    const renderPost = ({ item }) => {
        const userId = auth.currentUser?.uid;
        const alreadyLiked = item.likedBy?.includes(userId);

        return (
            <TouchableOpacity
                style={styles.postContainer}
                onPress={() =>
                    navigation.navigate('PostDetail', { post: item, focusComment: true })
                }
            >
                <View style={styles.postHeader}>
                    <UserAvatar />

                    <View style={styles.userInfoRow}>
                        <Text style={styles.username}>{item.user?.displayName || 'Unknown'}</Text>
                        <Text style={styles.timeElapsed}>{getTimeElapsed(item.timestamp)}</Text>
                    </View>
                </View>
                <Text style={styles.postTitle}>{item.title}</Text>
                <View style={styles.postActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleLikePress(item)}
                    >
                        <Ionicons
                            name={alreadyLiked ? 'heart' : 'heart-outline'}
                            size={20}
                            color="#8A56AC"
                        />
                        <Text style={styles.actionText}>{item.likedBy?.length || 0}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() =>
                            navigation.navigate('PostDetail', { post: item, focusComment: true })
                        }
                    >
                        <Ionicons name="chatbubble-outline" size={20} color="#8A56AC" />
                        <Text style={styles.actionText}>{item.commentCount || 0}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.separator} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={renderPost}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No posts yet. Be the first to post!</Text>
                }
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreatePost')}
            >
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    listContainer: { padding: 10, paddingBottom: 80 },
    emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
    postContainer: { marginBottom: 20 },
    postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    userInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -5,
    },
    username: { fontSize: 16, fontWeight: 'bold' },
    timeElapsed: { fontSize: 12, color: '#888', marginLeft: 8, fontWeight: 'bold' },
    postTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    postActions: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10 },
    actionButton: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
    actionText: { marginLeft: 5, color: '#8A56AC' },
    separator: { height: 1, backgroundColor: '#ddd' },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#8A56AC',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});