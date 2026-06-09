import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Linking } from 'react-native';

// Article card for articles on homepage
const ArticleCard = ({ article, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => {
            if (article.url) {
                Linking.openURL(article.url);
            }
        }}>
            <Image source={article.image} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>{article.title}</Text>
                <Text style={styles.summary} numberOfLines={3}>{article.summary}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginRight: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        height: 90,
        width: 300,
        overflow: 'hidden',
    },
    image: {
        width: 90,
        height: '100%',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        marginRight: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    summary: {
        fontSize: 14,
        color: '#666',
    },
});

export default ArticleCard;