import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Colors } from '../utils/colors';
import { isAdmin } from '../utils/adminCheck';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout, guestMode } = useAuth();
  const { subscription, hasActiveSubscription } = useSubscription();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  if (!user || guestMode) {
    return (
      <View style={styles.guestContainer}>
        <Text style={styles.guestIcon}>👤</Text>
        <Text style={styles.guestTitle}>
          {guestMode ? 'Guest Mode' : 'Not Logged In'}
        </Text>
        <Text style={styles.guestText}>
          {guestMode
            ? 'Create an account or login to access your profile, track progress, and sync your data across devices'
            : 'Please log in to view your profile'}
        </Text>
        <TouchableOpacity
          style={styles.guestLoginButton}
          onPress={() => navigation.getParent()?.navigate('Login' as never)}
        >
          <Text style={styles.guestLoginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const userIsAdmin = isAdmin(user?.email);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(user.email || 'U')}</Text>
        </View>
        <Text style={styles.email}>{user.email}</Text>
        {hasActiveSubscription ? (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium Member</Text>
          </View>
        ) : (
          <View style={styles.freeBadge}>
            <Text style={styles.freeText}>Free Plan</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Subscription')}
        >
          <Text style={styles.menuItemText}>
            {hasActiveSubscription ? 'Manage Subscription' : 'Upgrade to Premium'}
          </Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ProgressTab')}
        >
          <Text style={styles.menuItemText}>Test History</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.menuItemText}>Settings</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {userIsAdmin && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer Tools</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AdminDashboard')}
          >
            <Text style={styles.menuItemText}>🎛️ Admin Dashboard</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Admin')}
          >
            <Text style={styles.menuItemText}>🛠️ Firebase Data Tools</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Alert.alert(
              'Help & FAQ',
              'Common Questions:\n\n' +
                '• How do I access premium papers?\n' +
                '  Subscribe to Premium in the Subscription section.\n\n' +
                '• How are tests scored?\n' +
                '  Each correct answer = 1 point. Passing score is 60%.\n\n' +
                '• Can I retake tests?\n' +
                '  Yes! Take tests as many times as you want.'
            )
          }
        >
          <Text style={styles.menuItemText}>Help & FAQ</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Alert.alert(
              'Contact Support',
              'Need help?\n\nEmail: support@tefprep.com\n\nWe typically respond within 24 hours.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Send Email',
                  onPress: () =>
                    Alert.alert('Email', 'Email client would open here in production'),
                },
              ]
            )
          }
        >
          <Text style={styles.menuItemText}>Contact Support</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Alert.alert(
              'About TEFPrep Pro',
              'Version 1.0.0\n\n' +
                'TEFPrep Pro helps you prepare for the Test d\'Évaluation de Français (TEF) certification.\n\n' +
                'Practice with real exam-style questions and track your progress.\n\n' +
                '© 2026 TEFPrep Pro'
            )
          }
        >
          <Text style={styles.menuItemText}>About TEFPrep Pro</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notLoggedIn: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: 30,
    alignItems: 'center',
    paddingTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  email: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
  },
  premiumBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  premiumText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  freeBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  freeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginLeft: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  menuItemArrow: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    margin: 20,
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.background,
  },
  guestIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  guestText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  guestLoginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  guestLoginButtonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});
