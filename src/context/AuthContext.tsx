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
import { GOOGLE_WEB_CLIENT_ID } from '@env';

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

      // Create user document if user is logged in (don't await - do it in background)
      if (user) {
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
    // Logout from RevenueCat first
    try {
      await revenueCatService.logoutUser();
    } catch (error) {
      console.error('Failed to logout from RevenueCat:', error);
    }
    await signOut(auth);
    setGuestMode(false);
  };

  const continueAsGuest = () => {
    setGuestMode(true);
    setLoading(false);
  };

  // Configure Google Sign-In
  useEffect(() => {
    if (GOOGLE_WEB_CLIENT_ID) {
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
      });
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Check if device supports Google Play services
      await GoogleSignin.hasPlayServices();

      // Get user info
      const { idToken } = await GoogleSignin.signIn();

      // Create Firebase credential
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign in to Firebase
      const userCredential = await signInWithCredential(auth, googleCredential);

      // Extract name from Google profile
      const userInfo = await GoogleSignin.getCurrentUser();
      const displayName = userInfo?.user.name || '';
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create user document
      await createUserDocument(userCredential.user, firstName, lastName);

      // Identify user in RevenueCat
      try {
        await revenueCatService.identifyUser(userCredential.user.uid);
      } catch (error) {
        console.error('Failed to identify user in RevenueCat:', error);
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
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
