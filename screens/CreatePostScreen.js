import React, { useState, useLayoutEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // Add close and post buttons to the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={[styles.headerButton, { opacity: title.trim() ? 1 : 0.5 }]}
          onPress={handlePost}
          disabled={!title.trim()}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      ),
      title: 'New Post',
    });
  }, [navigation, title, body]);

  // Save a new post to Firestore
  const handlePost = async () => {
    if (!title.trim()) return;
    try {
      await addDoc(collection(db, 'posts'), {
        title: title.trim(),
        body: body.trim(),
        timestamp: serverTimestamp(),
        user: {
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL,
        },
        likedBy: [],
        commentCount: 0,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error adding post: ', error);
      Alert.alert('Error', 'Failed to create post.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title (required)"
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Body (optional)"
        style={styles.bodyInput}
        value={body}
        onChangeText={setBody}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerButton: { marginHorizontal: 15 },
  postButtonText: { fontSize: 16, fontWeight: 'bold', color: '#8A56AC' },
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  titleInput: { fontSize: 20, fontWeight: 'bold', borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20 },
  bodyInput: { flex: 1, fontSize: 16, textAlignVertical: 'top' },
});