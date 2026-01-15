import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import PapersScreen from '../screens/PapersScreen';
import PaperDetailScreen from '../screens/PaperDetailScreen';
import TestScreen from '../screens/TestScreen';
import TestResultsScreen from '../screens/TestResultsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import AdminScreen from '../screens/AdminScreen';

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
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon label="HomeTab" focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="PapersTab"
        component={PapersStack}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon label="PapersTab" focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressStack}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon label="ProgressTab" focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon label="ProfileTab" focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

// Root Navigator with Auth Check
export default function AppNavigator() {
  const { user, loading, guestMode } = useAuth();

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
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  tabIconText: {
    fontSize: 24,
  },
  tabLabel: {
    fontSize: 11,
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
