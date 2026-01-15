import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Create a user document in Firestore for a specific user ID
 * This is useful for syncing existing Firebase Auth users to Firestore
 *
 * @param userId - The Firebase Auth UID
 * @param email - User's email address
 * @param displayName - User's display name (optional)
 * @param testPremium - Whether to enable test premium (default: false)
 */
export const createUserDocumentManually = async (
  userId: string,
  email: string,
  displayName?: string,
  testPremium: boolean = false
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      console.log(`ℹ️ User document already exists for ${email}`);
      return;
    }

    await setDoc(userRef, {
      email,
      displayName: displayName || '',
      testPremium,
      isPremium: false,
      createdAt: Timestamp.fromDate(new Date()),
      lastLogin: Timestamp.fromDate(new Date()),
    });

    console.log(`✅ Created user document for ${email} (${userId})`);
  } catch (error) {
    console.error(`❌ Failed to create user document for ${email}:`, error);
    throw error;
  }
};

/**
 * Quick helper to create a user document for the currently logged-in user
 * Run this from the Admin panel or console if you need to manually create
 * your own user document
 */
export const syncCurrentUser = async (
  currentUserId: string,
  currentUserEmail: string
): Promise<void> => {
  try {
    console.log('🔄 Syncing current user to Firestore...');
    await createUserDocumentManually(currentUserId, currentUserEmail);
    console.log('✅ Current user synced successfully!');
  } catch (error) {
    console.error('❌ Failed to sync current user:', error);
    throw error;
  }
};

/**
 * Batch sync multiple users
 * Useful if you have multiple existing Firebase Auth users
 *
 * @param users - Array of user objects with id and email
 */
export const syncMultipleUsers = async (
  users: Array<{ id: string; email: string; displayName?: string }>
): Promise<{ success: number; failed: number; skipped: number }> => {
  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
  };

  console.log(`🔄 Starting batch sync of ${users.length} users...`);

  for (const user of users) {
    try {
      const userRef = doc(db, 'users', user.id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        console.log(`⏭️ Skipping ${user.email} (already exists)`);
        results.skipped++;
        continue;
      }

      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || '',
        testPremium: false,
        isPremium: false,
        createdAt: Timestamp.fromDate(new Date()),
        lastLogin: Timestamp.fromDate(new Date()),
      });

      console.log(`✅ Created user document for ${user.email}`);
      results.success++;
    } catch (error) {
      console.error(`❌ Failed to sync ${user.email}:`, error);
      results.failed++;
    }
  }

  console.log(`\n📊 Sync Results:`);
  console.log(`   ✅ Success: ${results.success}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   ⏭️ Skipped: ${results.skipped}`);

  return results;
};

/**
 * Check if a user document exists in Firestore
 *
 * @param userId - The Firebase Auth UID
 * @returns True if user document exists
 */
export const checkUserDocumentExists = async (userId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists();
  } catch (error) {
    console.error('❌ Error checking user document:', error);
    return false;
  }
};
