import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithCredential,
  OAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import { Platform } from 'react-native';
import { auth, db } from '../config/firebase';
import { revenueCatService } from '../services/revenueCatService';

// Use process.env for production builds (EAS) and fallback for development
const GOOGLE_WEB_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID || '';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  guestMode: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestMode, setGuestMode] = useState(false);

  // Create or update user document in Firestore
  const createUserDocument = async (user: User, firstName?: string, lastName?: string) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userRef, {
          email: user.email,
          firstName: firstName || '',
          lastName: lastName || '',
          displayName: user.displayName || (firstName && lastName ? `${firstName} ${lastName}` : ''),
          testPremium: false,
          isPremium: false,
          createdAt: Timestamp.fromDate(new Date()),
          lastLogin: Timestamp.fromDate(new Date()),
        });
        console.log('✅ Created user document in Firestore');
      } else {
        // Update last login time
        await setDoc(userRef, {
          lastLogin: Timestamp.fromDate(new Date()),
        }, { merge: true });
        console.log('✅ Updated user last login');
      }
    } catch (error) {
      console.error('❌ Failed to create/update user document:', error);
    }
  };

  useEffect(() => {
    console.log('🔵 Setting up Firebase auth listener...');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔵 Auth state changed! User:', user ? user.email : 'null');
      setUser(user);
      setLoading(false);

      // Clear guest mode when user signs in
      if (user) {
        setGuestMode(false);
        console.log('✅ Clearing guest mode - user signed in');

        // Create user document (don't await - do it in background)
        createUserDocument(user).catch(err => {
          console.warn('⚠️ Could not create user document - continuing anyway:', err);
        });
      }
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Create user document with name info
    await createUserDocument(userCredential.user, firstName, lastName);

    // Identify user in RevenueCat
    try {
      await revenueCatService.identifyUser(userCredential.user.uid);
    } catch (error) {
      console.error('Failed to identify user in RevenueCat:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Identify user in RevenueCat
    try {
      await revenueCatService.identifyUser(userCredential.user.uid);
    } catch (error) {
      console.error('Failed to identify user in RevenueCat:', error);
    }
  };

  const logout = async () => {
    console.log('🔵 Starting logout...');

    // Logout from RevenueCat first
    try {
      await revenueCatService.logoutUser();
      console.log('✅ Logged out from RevenueCat');
    } catch (error) {
      console.error('Failed to logout from RevenueCat:', error);
    }

    // Sign out from Google if currently signed in
    try {
      await GoogleSignin.signOut();
      console.log('✅ Signed out from Google');
    } catch (error) {
      // Ignore error if user wasn't signed in with Google
      console.log('ℹ️ Google sign out skipped (not signed in with Google)');
    }

    // Sign out from Firebase
    await signOut(auth);
    console.log('✅ Signed out from Firebase');

    // Clear guest mode
    setGuestMode(false);
    console.log('✅ Guest mode cleared');
  };

  const continueAsGuest = () => {
    setGuestMode(true);
    setLoading(false);
  };

  // Configure Google Sign-In
  useEffect(() => {
    if (GOOGLE_WEB_CLIENT_ID) {
      console.log('🔵 Configuring Google Sign-In with Web Client ID:',
        GOOGLE_WEB_CLIENT_ID.substring(0, 20) + '...');
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
      });
      console.log('✅ Google Sign-In configured');
    } else {
      console.error('❌ GOOGLE_WEB_CLIENT_ID is not set!');
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('🔵 Starting Google Sign-In...');

      // Check if device supports Google Play services
      await GoogleSignin.hasPlayServices();
      console.log('✅ Google Play Services available');

      // Get user info and tokens
      const signInResult = await GoogleSignin.signIn();
      console.log('✅ Google Sign-In result received:', {
        hasIdToken: !!signInResult.idToken,
        hasData: !!signInResult.data,
        keys: Object.keys(signInResult),
      });

      // Extract idToken - it might be at different locations depending on version
      const idToken = signInResult.idToken || signInResult.data?.idToken;

      if (!idToken) {
        console.error('❌ No idToken found in response:', JSON.stringify(signInResult, null, 2));
        throw new Error('Failed to get idToken from Google Sign-In');
      }

      console.log('✅ idToken extracted successfully');

      // Create Firebase credential
      const googleCredential = GoogleAuthProvider.credential(idToken);
      console.log('✅ Firebase credential created');

      // Sign in to Firebase
      const userCredential = await signInWithCredential(auth, googleCredential);
      console.log('✅ Signed in to Firebase:', userCredential.user.email);
      console.log('✅ User providerData:', JSON.stringify(userCredential.user.providerData, null, 2));

      // Extract name from Google profile
      const userInfo = await GoogleSignin.getCurrentUser();
      const displayName = userInfo?.user.name || '';
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      console.log('✅ Extracted user name:', { firstName, lastName });

      // Create user document
      await createUserDocument(userCredential.user, firstName, lastName);
      console.log('✅ User document created');

      // Identify user in RevenueCat
      try {
        await revenueCatService.identifyUser(userCredential.user.uid);
        console.log('✅ User identified in RevenueCat');
      } catch (error) {
        console.error('Failed to identify user in RevenueCat:', error);
      }
    } catch (error: any) {
      console.error('❌ Google Sign-In error:', error);
      throw error;
    }
  };

  const signInWithApple = async () => {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign-In is only available on iOS');
    }

    try {
      // Start Apple authentication request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = new OAuthProvider('apple.com').credential({
        idToken: identityToken,
        rawNonce: nonce,
      });

      // Sign in to Firebase
      const userCredential = await signInWithCredential(auth, appleCredential);

      // Extract name from Apple profile
      const firstName = appleAuthRequestResponse.fullName?.givenName || '';
      const lastName = appleAuthRequestResponse.fullName?.familyName || '';

      // Create user document
      await createUserDocument(userCredential.user, firstName, lastName);

      // Identify user in RevenueCat
      try {
        await revenueCatService.identifyUser(userCredential.user.uid);
      } catch (error) {
        console.error('Failed to identify user in RevenueCat:', error);
      }
    } catch (error: any) {
      console.error('Apple Sign-In Error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, guestMode, signUp, signIn, signInWithGoogle, signInWithApple, logout, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
