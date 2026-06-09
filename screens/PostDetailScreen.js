import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserAvatar from '../utils/UserAvatar';
import { getTimeElapsed } from '../utils/timeUtils';
import {
    collection,
    onSnapshot,
    addDoc,
    serverTimestamp,
    updateDoc,
    doc,
    increment,
} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export default function PostDetailScreen({ route, navigation }) {
    const { post, focusComment } = route.params;
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const commentInputRef = useRef(null);

    // Hide the bottom tab bar on this screen
    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
        return () => {
            navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
        };
    }, [navigation]);

    // Auto-focus comment input
    useEffect(() => {
        if (focusComment && commentInputRef.current) {
            commentInputRef.current.focus();
        }
    }, [focusComment]);

    // Listen to comments on this post
    useEffect(() => {
        let unsubscribe;

        const listenToComments = () => {
            const user = auth.currentUser;
            if (!user) return;

            const commentsRef = collection(db, 'posts', post.id, 'comments');
            unsubscribe = onSnapshot(commentsRef, (snapshot) => {
                const loadedComments = snapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    .sort((a, b) => {
                        const aTime = a.timestamp && a.timestamp.seconds ? a.timestamp.toMillis() : 0;
                        const bTime = b.timestamp && b.timestamp.seconds ? b.timestamp.toMillis() : 0;
                        return aTime - bTime;
                    });
                setComments(loadedComments);
            });
        };

        listenToComments();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [post.id]);

    // Add a new comment to Firestore
    const addComment = async () => {
        if (!commentText.trim()) return;
        const user = auth.currentUser;
        if (!user) return;
        const newComment = {
            text: commentText.trim(),
            timestamp: serverTimestamp(),
            user: {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
            },
        };
        try {
            await addDoc(collection(db, 'posts', post.id, 'comments'), newComment);
            await updateDoc(doc(db, 'posts', post.id), { commentCount: increment(1) });
            setCommentText('');
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const renderComment = ({ item }) => (
        <View style={styles.commentContainer}>
            <UserAvatar style={styles.commentAvatar} />
            <View style={styles.commentContentContainer}>
                <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{item.user.displayName}</Text>
                    <Text style={styles.commentTime}>{getTimeElapsed(item.timestamp)}</Text>
                </View>
                <Text style={styles.commentText}>{item.text}</Text>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            {/* Post Section*/}
            <View style={styles.postSection}>
                <View style={styles.postHeader}>
                    <UserAvatar />
                    <View style={styles.postUserDetails}>
                        <Text style={styles.postUsername}>{post.user?.displayName}</Text>
                        <Text style={styles.postTime}>{getTimeElapsed(post.timestamp)}</Text>
                    </View>
                </View>
                <View style={styles.postContent}>
                    <Text style={styles.postTitle}>{post.title}</Text>
                    {post.body ? <Text style={styles.postBody}>{post.body}</Text> : null}
                </View>
            </View>
            {/* Comments List */}
            <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyComments}>No comments yet.</Text>}
                contentContainerStyle={styles.commentsList}
            />
            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
                <TextInput
                    ref={commentInputRef}
                    placeholder="Write a comment..."
                    value={commentText}
                    onChangeText={setCommentText}
                    style={styles.commentInput}
                    autoFocus={focusComment}
                />
                <TouchableOpacity onPress={addComment} style={styles.commentSendButton}>
                    <Ionicons name="send" size={24} color="#8A56AC" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    postSection: { padding: 16, borderBottomWidth: 1, borderColor: '#ddd' },
    postHeader: { flexDirection: 'row', alignItems: 'center' },
    postUserDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    postUsername: { fontSize: 16, fontWeight: 'bold', marginRight: 5 },
    postTime: { fontSize: 12, color: '#888', fontWeight: 'bold' },
    postContent: { marginTop: 8 },
    postTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    postBody: { fontSize: 16, color: '#333' },
    commentsList: { padding: 16 },
    emptyComments: { textAlign: 'center', color: '#888', marginTop: 20 },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 16,
    },
    commentAvatar: { marginRight: 10 },
    commentContentContainer: { flex: 1 },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    commentUser: { fontSize: 16, fontWeight: 'bold', marginRight: 5 },
    commentTime: { fontSize: 12, color: '#888', fontWeight: 'bold' },
    commentText: { fontSize: 14, color: '#333', marginTop: 4 },
    commentInputContainer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderColor: '#ddd', padding: 10 },
    commentInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15 },
    commentSendButton: { marginLeft: 10 },
});