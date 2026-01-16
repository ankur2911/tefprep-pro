import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { revenueCatService } from '../services/revenueCatService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  guestMode: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestMode, setGuestMode] = useState(false);

  // Create or update user document in Firestore
  const createUserDocument = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName || '',
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

  const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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

  return (
    <AuthContext.Provider value={{ user, loading, guestMode, signUp, signIn, logout, continueAsGuest }}>
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
