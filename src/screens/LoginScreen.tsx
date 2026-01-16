import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../utils/colors';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function LoginScreen({ navigation }: Props) {
  const { signIn, signUp, signInWithGoogle, signInWithApple, continueAsGuest, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  // Navigate away when user is authenticated
  React.useEffect(() => {
    if (user) {
      console.log('✅ User authenticated - navigating to Main');
      // Check if we can go back (means we're in a modal)
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [user, navigation]);

  // Reset auth success flag when component unmounts
  React.useEffect(() => {
    return () => {
      setAuthSuccess(false);
      setSsoLoading(false);
      setLoading(false);
    };
  }, []);

  const handleSubmit = async () => {
    console.log('🔵 Login button clicked!');

    if (!email || !password) {
      console.log('❌ Validation failed: empty fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Additional validation for sign up
    if (!isLogin && (!firstName.trim() || !lastName.trim())) {
      console.log('❌ Validation failed: missing name');
      Alert.alert('Error', 'Please enter your first and last name');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Validation failed: invalid email');
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      console.log('❌ Validation failed: password too short');
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    console.log(`✅ Validation passed, attempting ${isLogin ? 'login' : 'signup'}...`);
    setLoading(true);
    try {
      if (isLogin) {
        console.log('📧 Signing in with email:', email);
        await signIn(email, password);
        console.log('✅ Sign in successful!');
        setAuthSuccess(true);
      } else {
        console.log('📧 Signing up with email:', email);
        await signUp(email, password, firstName.trim(), lastName.trim());
        console.log('✅ Sign up successful!');
        setAuthSuccess(true);
        Alert.alert('Success', 'Account created successfully!');
      }
      // Keep loading state briefly, then navigation will happen automatically
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error: any) {
      console.error('❌ Authentication error:', error);
      Alert.alert('Error', error.message || 'Authentication failed');
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    console.log('🔵 Guest mode button clicked!');

    // Prevent guest mode if authentication is in progress or already successful
    if (loading || ssoLoading || authSuccess || user) {
      console.log('⚠️ Preventing guest mode - auth in progress or user already authenticated');
      return;
    }

    continueAsGuest();
    console.log('✅ Guest mode activated');
  };

  const handleGoogleSignIn = async () => {
    console.log('🔵 Google Sign-In button clicked!');
    setSsoLoading(true);
    try {
      await signInWithGoogle();
      console.log('✅ Google Sign-In successful!');
      setAuthSuccess(true);
      // Keep loading state for a moment to prevent interactions, then clear
      setTimeout(() => {
        setSsoLoading(false);
      }, 500);
    } catch (error: any) {
      console.error('❌ Google Sign-In error:', error);
      if (error.code === '12501') {
        // User cancelled
        console.log('User cancelled Google Sign-In');
      } else {
        Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
      }
      setSsoLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    console.log('🔵 Apple Sign-In button clicked!');
    setSsoLoading(true);
    try {
      await signInWithApple();
      console.log('✅ Apple Sign-In successful!');
      setAuthSuccess(true);
      // Keep loading state for a moment to prevent interactions, then clear
      setTimeout(() => {
        setSsoLoading(false);
      }, 500);
    } catch (error: any) {
      console.error('❌ Apple Sign-In error:', error);
      if (error.code !== '1001') {
        // Don't show error if user cancelled (code 1001)
        Alert.alert('Error', 'Failed to sign in with Apple. Please try again.');
      }
      setSsoLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>TEFPrep Pro</Text>
        <Text style={styles.subtitle}>Master Your French Certification</Text>

        <View style={styles.form}>
          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                placeholderTextColor={Colors.textSecondary}
              />

              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                placeholderTextColor={Colors.textSecondary}
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.textSecondary}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={Colors.textSecondary}
          />

          {isLogin && (
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPasswordLink}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </Text>
          </TouchableOpacity>

          {isLogin && (
            <>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={[styles.ssoButton, styles.googleButton, ssoLoading && styles.buttonDisabled]}
                onPress={handleGoogleSignIn}
                disabled={ssoLoading || loading}
              >
                <Text style={styles.ssoButtonText}>
                  {ssoLoading ? 'Please wait...' : '🔵 Continue with Google'}
                </Text>
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={[styles.ssoButton, styles.appleButton, ssoLoading && styles.buttonDisabled]}
                  onPress={handleAppleSignIn}
                  disabled={ssoLoading || loading}
                >
                  <Text style={[styles.ssoButtonText, styles.appleButtonText]}>
                    {ssoLoading ? 'Please wait...' : ' Continue with Apple'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          <TouchableOpacity
            onPress={handleGuestMode}
            disabled={loading || ssoLoading || authSuccess}
          >
            <Text
              style={[
                styles.guestText,
                (loading || ssoLoading || authSuccess) && styles.guestTextDisabled,
              ]}
            >
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: Colors.textPrimary,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchText: {
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  guestText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  guestTextDisabled: {
    opacity: 0.3,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  ssoButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  googleButton: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  appleButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  ssoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  appleButtonText: {
    color: '#fff',
  },
});
