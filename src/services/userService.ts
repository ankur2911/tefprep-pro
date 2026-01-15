import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  testPremium?: boolean;
  isPremium?: boolean;
  createdAt?: Date;
}

/**
 * Get all users from Firestore
 * @returns Array of users
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const users: User[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        email: data.email || '',
        displayName: data.displayName || '',
        testPremium: data.testPremium || false,
        isPremium: data.isPremium || false,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });

    return users;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    throw error;
  }
};

/**
 * Get a single user by ID
 * @param userId User ID
 * @returns User object or null
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data();
    return {
      id: userDoc.id,
      email: data.email || '',
      displayName: data.displayName || '',
      testPremium: data.testPremium || false,
      isPremium: data.isPremium || false,
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    throw error;
  }
};

/**
 * Toggle test premium access for a user
 * @param userId User ID
 * @param enable Enable or disable test premium
 */
export const toggleTestPremium = async (userId: string, enable: boolean): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      testPremium: enable,
      testPremiumUpdatedAt: Timestamp.fromDate(new Date()),
    });

    console.log(`✅ Test premium ${enable ? 'enabled' : 'disabled'} for user ${userId}`);
  } catch (error) {
    console.error('❌ Error toggling test premium:', error);
    throw error;
  }
};

/**
 * Check if a user has test premium access
 * @param userId User ID
 * @returns True if user has test premium
 */
export const hasTestPremium = async (userId: string): Promise<boolean> => {
  try {
    const user = await getUserById(userId);
    return user?.testPremium === true;
  } catch (error) {
    console.error('❌ Error checking test premium:', error);
    return false;
  }
};
