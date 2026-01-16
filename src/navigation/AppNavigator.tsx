import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ActivityIndicator, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import PapersScreen from '../screens/PapersScreen';
import PaperDetailScreen from '../screens/PaperDetailScreen';
import TestScreen from '../screens/TestScreen';
import TestResultsScreen from '../screens/TestResultsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import AdminScreen from '../screens/AdminScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ManagePapersScreen from '../screens/admin/ManagePapersScreen';
import AddEditPaperScreen from '../screens/admin/AddEditPaperScreen';
import ManageUsersScreen from '../screens/admin/ManageUsersScreen';
import ManageQuestionsScreen from '../screens/admin/ManageQuestionsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Papers Stack
function PapersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Papers"
        component={PapersScreen}
        options={{ title: 'Practice Papers' }}
      />
      <Stack.Screen
        name="PaperDetail"
        component={PaperDetailScreen}
        options={{ title: 'Paper Details' }}
      />
      <Stack.Screen
        name="Test"
        component={TestScreen}
        options={{ title: 'Test', headerShown: false }}
      />
      <Stack.Screen
        name="TestResults"
        component={TestResultsScreen}
        options={{ title: 'Test Results', headerLeft: () => null }}
      />
    </Stack.Navigator>
  );
}

// Progress Stack
function ProgressStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ title: 'My Progress' }}
      />
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: 'Change Password' }}
      />
      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={{ title: 'Admin Panel' }}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Admin Dashboard' }}
      />
      <Stack.Screen
        name="ManagePapers"
        component={ManagePapersScreen}
        options={{ title: 'Manage Papers' }}
      />
      <Stack.Screen
        name="AddEditPaper"
        component={AddEditPaperScreen}
        options={{ title: 'Add/Edit Paper' }}
      />
      <Stack.Screen
        name="ManageUsers"
        component={ManageUsersScreen}
        options={{ title: 'User Management' }}
      />
      <Stack.Screen
        name="ManageQuestions"
        component={ManageQuestionsScreen}
        options={{ title: 'Manage Questions' }}
      />
    </Stack.Navigator>
  );
}

// Tab Bar Icon Component
function TabBarIcon({ label, focused }: { label: string; focused: boolean }) {
  const iconMap: { [key: string]: string } = {
    HomeTab: '🏠',
    PapersTab: '📝',
    ProgressTab: '📊',
    ProfileTab: '👤',
  };

  const labelMap: { [key: string]: string } = {
    HomeTab: 'Home',
    PapersTab: 'Papers',
    ProgressTab: 'Progress',
    ProfileTab: 'Profile',
  };

  return (
    <View style={styles.tabIcon}>
      <Text style={styles.tabIconText}>{iconMap[label]}</Text>
      <Text
        style={[styles.tabLabel, focused && styles.tabLabelFocused]}
        numberOfLines={1}
      >
        {labelMap[label]}
      </Text>
    </View>
  );
}

// Main Tab Navigator
function MainTabs() {
  const insets = useSafeAreaInsets();

  // Helper function to check if we're currently on the Test screen
  const isOnTestScreen = (state: any): boolean => {
    if (!state) return false;

    // Get the currently active route in the tab navigator
    const tabRoute = state.routes[state.index];

    if (!tabRoute.state) return false;

    // Get the currently active route in the stack navigator
    const stackRoute = tabRoute.state.routes[tabRoute.state.index];

    return stackRoute.name === 'Test';
  };

  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom,
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon label="HomeTab" focused={focused} />,
          tabBarLabel: () => null,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            if (isOnTestScreen(state)) {
              e.preventDefault();
              Alert.alert(
                'Quit Test?',
                'Are you sure you want to quit this test? Your progress will be lost and the test will be reset.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Quit',
                    style: 'destructive',
                    onPress: () => {
                      navigation.navigate('PapersTab', { screen: 'Papers' });
                      setTimeout(() => navigation.navigate('HomeTab'), 100);
                    },
                  },
                ]
              );
            }
          },
        })}
      />
      <Tab.Screen
        name="PapersTab"
        component={PapersStack}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon label="PapersTab" focused={focused} />,
          tabBarLabel: () => null,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            if (isOnTestScreen(state)) {
              e.preventDefault();
              Alert.alert(
                'Quit Test?',
                'Are you sure you want to quit this test? Your progress will be lost and the test will be reset.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Quit',
                    style: 'destructive',
                    onPress: () => {
                      navigation.navigate('PapersTab', { screen: 'Papers' });
                    },
                  },
                ]
              );
            }
          },
        })}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressStack}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon label="ProgressTab" focused={focused} />,
          tabBarLabel: () => null,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            if (isOnTestScreen(state)) {
              e.preventDefault();
              Alert.alert(
                'Quit Test?',
                'Are you sure you want to quit this test? Your progress will be lost and the test will be reset.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Quit',
                    style: 'destructive',
                    onPress: () => {
                      navigation.navigate('PapersTab', { screen: 'Papers' });
                      setTimeout(() => navigation.navigate('ProgressTab'), 100);
                    },
                  },
                ]
              );
            }
          },
        })}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon label="ProfileTab" focused={focused} />,
          tabBarLabel: () => null,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            if (isOnTestScreen(state)) {
              e.preventDefault();
              Alert.alert(
                'Quit Test?',
                'Are you sure you want to quit this test? Your progress will be lost and the test will be reset.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Quit',
                    style: 'destructive',
                    onPress: () => {
                      navigation.navigate('PapersTab', { screen: 'Papers' });
                      setTimeout(() => navigation.navigate('ProfileTab'), 100);
                    },
                  },
                ]
              );
            }
          },
        })}
      />
    </Tab.Navigator>
  );
}

// Root Navigator with Auth Check
export default function AppNavigator() {
  const { user, loading, guestMode } = useAuth();

  console.log('🔵 AppNavigator render - user:', user?.email || 'null', 'loading:', loading, 'guestMode:', guestMode);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B21B6" />
        <Text style={styles.loadingText}>Loading TEFPrep Pro...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user || guestMode ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="Subscription"
            component={SubscriptionScreen}
            options={{
              headerShown: true,
              title: 'Subscription',
              presentation: 'modal'
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
              presentation: 'modal'
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{
              headerShown: true,
              title: 'Reset Password',
              presentation: 'modal'
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{
              headerShown: true,
              title: 'Reset Password'
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    paddingVertical: 4,
  },
  tabIconText: {
    fontSize: 24,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  tabLabelFocused: {
    color: '#5B21B6',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
});
