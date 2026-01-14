import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MOCK_PAPERS } from './mockData';

/**
 * ONE-TIME SCRIPT: Populate Firebase with all mock papers
 *
 * Run this once to add all sample papers to your Firebase database.
 * After running, you can switch back to loading from Firebase.
 *
 * To run: Call this function from a component (e.g., a hidden admin button)
 */
export const populateFirebaseWithPapers = async () => {
  console.log('Starting to populate Firebase with papers...');

  try {
    const papersRef = collection(db, 'papers');

    for (const paper of MOCK_PAPERS) {
      // Include the id field in the document data
      await setDoc(doc(papersRef, paper.id), paper);
      console.log(`Added paper: ${paper.title} (ID: ${paper.id})`);
    }

    console.log('✅ Successfully added all papers to Firebase!');
    return { success: true, count: MOCK_PAPERS.length };
  } catch (error) {
    console.error('❌ Error populating Firebase:', error);
    throw error;
  }
};

/**
 * Delete all papers from Firebase (use with caution!)
 */
export const clearAllPapers = async () => {
  console.warn('This will delete all papers from Firebase!');
  // Implementation left intentionally blank for safety
  // Add deletion logic only if needed
};
