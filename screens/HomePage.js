import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    ImageBackground,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';

import QuickActionCard from '../components/QuickActionCard';
import CalendarCard from '../components/CalendarCard';
import ArticleCard from '../components/ArticleCard';

const screenHeight = Dimensions.get('window').height;
const GRADIENT_HEIGHT = screenHeight * 0.35;

const HomeScreen = ({ navigation }) => {
    const scrollY = useRef(new Animated.Value(0)).current; // Tracks scroll position

    const gradientTranslateY = scrollY.interpolate({
        inputRange: [0, GRADIENT_HEIGHT],
        outputRange: [0, GRADIENT_HEIGHT * 0.5],
        extrapolate: 'clamp',
    });

    // Interpolate header background color: from transparent to white.
    const headerBackgroundColor = scrollY.interpolate({
        inputRange: [0, GRADIENT_HEIGHT * 0.7],
        outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'],
        extrapolate: 'clamp',
    });

    const [firstName, setFirstName] = useState('');
    const [symptomRecords, setSymptomRecords] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    console.log('Fetching data for user:', user.uid);

                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        console.log('User data retrieved:', userData);

                        if (userData.firstName) {
                            setFirstName(userData.firstName);
                        } else {
                            console.log('First name field is missing in Firestore document.');
                        }
                    } else {
                        console.log('No user document found in Firestore.');
                    }
                } else {
                    console.log('No authenticated user found.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    // Fetch symptom records for the current user and date.
    useEffect(() => {
        let unsubscribe;

        const listenToSymptoms = () => {
            const user = auth.currentUser;
            if (!user) return;

            const today = new Date().toISOString().split('T')[0];
            const userRef = doc(db, 'users', user.uid);
            const symptomsRef = collection(userRef, 'symptoms');
            const todayDocRef = doc(symptomsRef, today);

            unsubscribe = onSnapshot(todayDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    setSymptomRecords(docSnap.data().symptoms || []);
                } else {
                    setSymptomRecords([]);
                }
            });
        };

        listenToSymptoms();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);


    // Set animated transparent header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerBackground: () => (
                <Animated.View style={{ flex: 1, backgroundColor: headerBackgroundColor }} />
            ),
        });
    }, [navigation, headerBackgroundColor]);

    const articles = [
        {
            id: '1',
            title: 'Anxiety and Cancer',
            summary: 'Understanding and managing anxiety after a cancer diagnosis.',
            image: require('../assets/articles/anxiety.jpeg'),
            url: 'https://www.macmillan.org.uk/cancer-information-and-support/impacts-of-cancer/anxiety',
        },
        {
            id: '2',
            title: 'Hair loss during treatment',
            summary: 'What to expect and how to manage it.',
            image: require('../assets/articles/hairloss.jpeg'),
            uri: 'https://www.macmillan.org.uk/cancer-information-and-support/impacts-of-cancer/hair-loss/hair-loss-during-treatment',
        },
        {
            id: '3',
            title: 'Building-Up Diet',
            summary: 'Tips to help you gain weight.',
            image: require('../assets/articles/apple.jpg'),
            uri: 'https://www.macmillan.org.uk/cancer-information-and-support/impacts-of-cancer/building-up-diet',
        },
    ];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* Animated ScrollView for the content */}
            <Animated.ScrollView
                contentContainerStyle={styles.scrollContainer}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {/* Top gradient section */}
                <Animated.View style={[styles.gradientContainer, { transform: [{ translateY: gradientTranslateY }] }]}>
                    <ImageBackground
                        source={require('../assets/images/grad.jpg')}
                        style={styles.gradientImage}
                        imageStyle={styles.gradientImageStyle}
                    >
                        <View style={styles.gradientOverlay}>
                            <Text style={styles.greeting}>
                                Hello {firstName ? firstName : 'User'},
                            </Text>
                            <Text style={styles.greetingSub}>How are you today?</Text>
                        </View>
                    </ImageBackground>
                </Animated.View>

                {/* Main Content */}
                <View style={styles.contentContainer}>
                    {/* Quick Access Buttons */}
                    <View style={styles.fixedQuickActions}>
                        <TouchableOpacity onPress={() => navigation.navigate('ToDo')}>
                            <QuickActionCard icon="checkmark-done-outline" label="To-Do" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Track')}>
                            <QuickActionCard icon="thermometer-outline" label="Symptoms" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Community', { screen: 'CreatePost' })}>
                            <QuickActionCard icon="chatbubble-ellipses-outline" label="Post" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('JournalList')}>
                            <QuickActionCard icon="pencil-outline" label="Journal" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.calendarHeading}>
                        <Text style={styles.sectionTitle}>Today</Text>
                    </View>

                    {/* Mini Calendar */}
                    <CalendarCard />

                    {/* Symptom Report Button */}
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            padding: 15,
                            borderRadius: 12,
                            marginHorizontal: 10,
                            marginBottom: 10,
                            marginTop: 10,
                            borderWidth: 1,
                            borderColor: '#e0e0e0',
                        }}
                        onPress={() => {
                            if (symptomRecords.length > 0) {
                                navigation.navigate('Track', {
                                    screen: 'SymptomReportsScreen',
                                    params: { reportedSymptoms: symptomRecords }
                                });
                            } else {
                                navigation.navigate('Track', {
                                    screen: 'AllSymptomsScreen'
                                });
                            }
                        }}
                    >
                        <Ionicons name="clipboard-outline" size={24} color="#8A56AC" style={{ marginRight: 10 }} />
                        <Text style={{ flex: 1, fontSize: 16, fontWeight: 'normal' }}>
                            {symptomRecords.length === 0
                                ? 'No Symptoms Reported Today'
                                : `${symptomRecords.length} Symptom${symptomRecords.length > 1 ? 's' : ''} Reported Today`}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#8A56AC" />
                    </TouchableOpacity>

                    <View style={styles.articlesHeading}>
                        <Text style={styles.sectionTitle}>Articles</Text>
                    </View>

                    <FlatList
                        data={articles}
                        renderItem={({ item }) => <ArticleCard article={item} />}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 10, paddingBottom: 10 }}
                    />
                </View>
            </Animated.ScrollView>
        </KeyboardAvoidingView>
    );
};

const HomePage = ({ navigation }) => {
    return <HomeScreen navigation={navigation} />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollContainer: {
    },
    gradientContainer: {
        height: GRADIENT_HEIGHT,
    },
    gradientImage: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    gradientImageStyle: {
        resizeMode: 'cover',
    },
    gradientOverlay: {
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    greeting: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },
    greetingSub: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        paddingBottom: 10,
    },
    contentContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -20,
        paddingTop: 10,
    },
    fixedQuickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    calendarHeading: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    articlesHeading: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default HomePage;