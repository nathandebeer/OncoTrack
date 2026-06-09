import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

// Import Screens
import HomePage from './screens/HomePage';
import SchedulePage from './screens/SchedulePage';
import TrackPage from './screens/TrackPage';
import CommunityPage from './screens/CommunityPage';
import ChatPage from './screens/ChatPage';
import AuthScreen from './screens/SignUpOptionsScreen';
import LoginScreen from './screens/LoginScreen.js';
import EmailSignUpScreen from './screens/EmailSignUpScreen';
import EditReminder from './screens/EditReminder';
import CreatePostScreen from './screens/CreatePostScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import UserAvatar from './utils/UserAvatar.js';
import AllSymptomsScreen from './screens/AllSymptomsScreen';
import SymptomDetailScreen from './screens/SymptomDetailScreen';
import SymptomReportsScreen from './screens/SymptomReportsScreen';
import TermsAndConditions from './screens/TermsAndConditions';
import PrivacyPolicy from './screens/PrivacyPolicy';
import JournalListScreen from './screens/JournalListScreen';
import AddJournalEntryScreen from './screens/AddJournalEntryScreen';
import ViewJournalEntryScreen from './screens/ViewJournalEntryScreen';
import ToDoScreen from './screens/ToDoScreen';
import { resetTo } from './navigation/navigationRef';


// -- Notification handler setup for push notifications -----------------------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// -- Navigator Stack Setup ----------------------------------------------------
const Stack = createStackNavigator();
const CommunityStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

// -- Home Stack Navigator -----------------------------------------------------
function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 0,
        },
      }}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={HomePage}
        options={({ navigation }) => ({
          title: 'Home',
          headerLeft: () => <MenuIcon navigation={navigation} />,
          headerRight: () => <UserAvatar />,
        })}
      />
      <HomeStack.Screen
        name="JournalList"
        component={JournalListScreen}
        options={{ title: 'Journal', headerBackTitle: 'Back' }}
      />
      <HomeStack.Screen
        name="AddJournalEntry"
        component={AddJournalEntryScreen}
        options={{ title: 'New Entry', headerBackTitle: 'Back' }}
      />
      <HomeStack.Screen
        name="ViewJournalEntry"
        component={ViewJournalEntryScreen}
        options={{ title: 'Journal Entry', headerBackTitle: 'Back' }}
      />
      <HomeStack.Screen
        name="ToDo"
        component={ToDoScreen}
        options={{ title: 'To-Do List', headerBackTitle: 'Back' }}
      />
    </HomeStack.Navigator>
  );
}

// -- Menu Icon Component -------------------------------------------------
function MenuIcon({ navigation }) {
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 15 }}>
      <Ionicons name="menu" size={24} color="black" />
    </TouchableOpacity>
  );
}

// -- Community Stack Navigator --------------------------------------------
function CommunityStackScreen() {
  return (
    <CommunityStack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 0,
        },
      }}
    >
      <CommunityStack.Screen
        name="CommunityMain"
        component={CommunityPage}
        options={({ navigation }) => ({
          title: 'Community',
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => <MenuIcon navigation={navigation} />,
          headerRight: () => <UserAvatar />,
        })}
      />
      <CommunityStack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{
          title: "Create Post",
        }}
      />
      <CommunityStack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          title: "Post Details",
        }}
      />
    </CommunityStack.Navigator>
  );
}

// -- Schedule Stack Navigator ---------------------------------------------
function ScheduleStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 0,
        },
      }}
    >
      <Stack.Screen
        name="ScheduleMain"
        component={SchedulePage}
        options={({ navigation }) => ({
          title: 'Schedule',
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => <MenuIcon navigation={navigation} />,
          headerRight: () => <UserAvatar />,
        })}
      />

      <Stack.Screen name="EditReminder" component={EditReminder} options={{ title: 'Edit Reminder', headerBackTitle: 'Back' }} />
    </Stack.Navigator>
  );
}

// -- Bottom Tab Navigator -------------------------------------------------
function MainAppTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: '#000',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#8A56AC',
        tabBarInactiveTintColor: '#808080',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={({ navigation }) => ({
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleStack}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Track"
        component={TrackStack}
        options={({ navigation }) => ({
          tabBarIcon: ({ color, size }) => <Ionicons name="pulse" size={size} color={color} />,
          headerLeft: () => <MenuIcon navigation={navigation} />,
          headerRight: () => <UserAvatar />,
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="Community"
        component={CommunityStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="OncoAI"
        component={ChatPage}
        options={({ navigation }) => ({
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} />,
          headerLeft: () => <MenuIcon navigation={navigation} />,
          headerRight: () => <UserAvatar />,
        })}
      />
    </Tab.Navigator >
  );
}

// -- Custom Drawer ----------------------------------------------------------
function CustomDrawerContent(props) {
  const handleSignOut = async () => {
    try {
      console.log("Unsubscribing from Firestore listeners before signing out...");
      if (typeof unsubscribeFromFirestore === 'function') {
        unsubscribeFromFirestore();
      }
      await signOut(auth);
      console.log('Successfully signed out');
      resetTo('Auth');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Home"
        onPress={() => props.navigation.navigate('MainAppTabs', { screen: 'Home' })}
        icon={({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />}
      />
      <DrawerItem
        label="Schedule"
        onPress={() => props.navigation.navigate('MainAppTabs', { screen: 'Schedule' })}
        icon={({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />}
      />
      <DrawerItem
        label="Track Symptoms"
        onPress={() => props.navigation.navigate('MainAppTabs', { screen: 'Track' })}
        icon={({ color, size }) => <Ionicons name="pulse-outline" size={size} color={color} />}
      />
      <DrawerItem
        label="Community"
        onPress={() => props.navigation.navigate('MainAppTabs', { screen: 'Community' })}
        icon={({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />}
      />
      <DrawerItem
        label="OncoAI"
        onPress={() => props.navigation.navigate('MainAppTabs', { screen: 'OncoAI' })}
        icon={({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} />}
      />
      <DrawerItem
        label="To-Do List"
        onPress={() => props.navigation.navigate('MainAppTabs', { screen: 'Home', params: { screen: 'ToDo' } })}
        icon={({ color, size }) => <Ionicons name="checkmark-done-outline" size={size} color={color} />}
      />
      <DrawerItem
        label="Journal"
        onPress={() => props.navigation.navigate('MainAppTabs', { screen: 'Home', params: { screen: 'JournalList' } })}
        icon={({ color, size }) => <Ionicons name="pencil-outline" size={size} color={color} />}
      />
      <DrawerItem
        label="Terms & Conditions"
        onPress={() => props.navigation.navigate('TermsAndConditions')}
        icon={({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />}
      />
      <DrawerItem
        label="Privacy Policy"
        onPress={() => props.navigation.navigate('PrivacyPolicy')}
        icon={({ color, size }) => <Ionicons name="shield-checkmark-outline" size={size} color={color} />}
      />
      <DrawerItem
        label="Sign Out"
        onPress={handleSignOut}
        icon={({ color, size }) => <Ionicons name="exit-outline" size={size} color={color} />}
      />
    </DrawerContentScrollView>
  );
}

// -- Drawer Navigator -------------------------------------------------------
function AppDrawer() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name="MainAppTabs"
        component={MainAppTabs}
        options={{ drawerItemStyle: { height: 0 } }}
      />
    </Drawer.Navigator>
  );
}

// -- Track Stack Navigator ---------------------------------------------
function TrackStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 0,
        },
      }}
    >
      <Stack.Screen
        name="TrackMain"
        component={TrackPage}
        options={({ navigation }) => ({
          title: 'Track Symptoms',
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => <MenuIcon navigation={navigation} />,
          headerRight: () => <UserAvatar />,
        })}
      />
      <Stack.Screen
        name="AllSymptomsScreen"
        component={AllSymptomsScreen}
        options={{ title: 'Select a Symptom to Record' }}
      />
      <Stack.Screen
        name="SymptomDetailScreen"
        component={SymptomDetailScreen}
        options={{ title: 'Record Symptom' }}
      />
      <Stack.Screen
        name="SymptomReportsScreen"
        component={SymptomReportsScreen}
        options={{
          title: 'Reported Symptoms',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
    </Stack.Navigator>
  );
}

// -- Root Navigator -------------------------------------------------------
const RootStack = createStackNavigator();
export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  if (!authChecked) return null;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <RootStack.Screen name="Auth" component={AuthScreen} />
            <RootStack.Screen name="LoginScreen" component={LoginScreen} />
            <RootStack.Screen name="EmailSignUpScreen" component={EmailSignUpScreen} />
          </>
        ) : (
          <>
            <RootStack.Screen name="MainApp" component={AppDrawer} />
          </>
        )}

        {/* Always available screens */}
        <RootStack.Screen name="TermsAndConditions" component={TermsAndConditions} />
        <RootStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}