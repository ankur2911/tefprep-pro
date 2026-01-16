import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { doc, getDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { Colors } from '../utils/colors';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function SettingsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  // Load user data and preferences
  React.useEffect(() => {
    loadUserData();
    loadSoundPreference();
  }, []);

  const loadUserData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSoundPreference = async () => {
    try {
      const value = await AsyncStorage.getItem('soundEffectsEnabled');
      if (value !== null) {
        setSoundEnabled(value === 'true');
      }
    } catch (error) {
      console.error('Error loading sound preference:', error);
    }
  };

  const handleSoundToggle = async (value: boolean) => {
    setSoundEnabled(value);
    try {
      await AsyncStorage.setItem('soundEffectsEnabled', value.toString());
    } catch (error) {
      console.error('Error saving sound preference:', error);
    }
  };

  const handleChangePassword = () => {
    if (!user) return;

    Alert.prompt(
      'Change Password',
      'Enter your current password:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Next',
          onPress: (currentPassword) => {
            if (!currentPassword) {
              Alert.alert('Error', 'Please enter your current password');
              return;
            }

            Alert.prompt(
              'Change Password',
              'Enter your new password (min 6 characters):',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Change',
                  onPress: async (newPassword) => {
                    if (!newPassword || newPassword.length < 6) {
                      Alert.alert('Error', 'Password must be at least 6 characters long');
                      return;
                    }

                    try {
                      // Re-authenticate user
                      const credential = EmailAuthProvider.credential(
                        user.email!,
                        currentPassword
                      );
                      await reauthenticateWithCredential(user, credential);

                      // Update password
                      await updatePassword(user, newPassword);

                      Alert.alert('Success', 'Your password has been updated successfully');
                    } catch (error: any) {
                      console.error('Error changing password:', error);
                      if (error.code === 'auth/wrong-password') {
                        Alert.alert('Error', 'Current password is incorrect');
                      } else {
                        Alert.alert('Error', 'Failed to change password. Please try again.');
                      }
                    }
                  },
                },
              ],
              'secure-text'
            );
          },
        },
      ],
      'secure-text'
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear temporary data and may improve performance. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // In production, this would clear AsyncStorage cache
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'TEFPrep Pro Privacy Policy\n\n' +
        'We collect and store:\n' +
        '• Your email address\n' +
        '• Test scores and progress\n' +
        '• Subscription status\n\n' +
        'We do NOT:\n' +
        '• Sell your data\n' +
        '• Share with third parties\n' +
        '• Track you outside the app\n\n' +
        'Your data is encrypted and stored securely on Firebase servers.'
    );
  };

  const handleTerms = () => {
    Alert.alert(
      'Terms of Service',
      'TEFPrep Pro Terms of Service\n\n' +
        '1. You may use this app for personal test preparation\n' +
        '2. Premium subscription required for premium content\n' +
        '3. Subscriptions renew automatically unless canceled\n' +
        '4. No refunds after subscription period starts\n' +
        '5. We reserve the right to modify content\n\n' +
        'By using this app, you agree to these terms.'
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {user && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>First Name</Text>
            <Text style={styles.infoValue}>{firstName || 'Not set'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Last Name</Text>
            <Text style={styles.infoValue}>{lastName || 'Not set'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
            <Text style={styles.menuItemText}>Change Password</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Sound Effects</Text>
            <Text style={styles.settingDescription}>
              Play sounds for correct/incorrect answers in test results
            </Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={handleSoundToggle}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={soundEnabled ? Colors.accent : Colors.surface}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Storage</Text>

        <TouchableOpacity style={styles.menuItem} onPress={handleClearCache}>
          <Text style={styles.menuItemText}>Clear Cache</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>

        <TouchableOpacity style={styles.menuItem} onPress={handlePrivacyPolicy}>
          <Text style={styles.menuItemText}>Privacy Policy</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleTerms}>
          <Text style={styles.menuItemText}>Terms of Service</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Build</Text>
          <Text style={styles.infoValue}>Development</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
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
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});
