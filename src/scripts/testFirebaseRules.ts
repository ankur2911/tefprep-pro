import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Test Firebase security rules to diagnose permission issues
 */
export const testFirebaseRules = async () => {
  console.log('=== Testing Firebase Security Rules ===\n');

  const testResults = {
    paperWrite: false,
    paperRead: false,
    questionWrite: false,
    questionRead: false,
    errors: [] as string[],
  };

  try {
    // Test 1: Write to papers collection
    console.log('Test 1: Writing to papers collection...');
    try {
      const testPaperRef = doc(db, 'papers', 'test_paper');
      await setDoc(testPaperRef, {
        title: 'Test Paper',
        description: 'Test',
        category: 'Test',
        difficulty: 'Test',
        duration: 30,
        questionsCount: 1,
        thumbnail: '',
        isPremium: false,
      });
      testResults.paperWrite = true;
      console.log('✓ Can write to papers collection');
    } catch (error: any) {
      testResults.errors.push(`Paper write: ${error.message}`);
      console.log('✗ Cannot write to papers collection:', error.message);
    }

    // Test 2: Read from papers collection
    console.log('\nTest 2: Reading from papers collection...');
    try {
      const testPaperRef = doc(db, 'papers', 'test_paper');
      await getDoc(testPaperRef);
      testResults.paperRead = true;
      console.log('✓ Can read from papers collection');
    } catch (error: any) {
      testResults.errors.push(`Paper read: ${error.message}`);
      console.log('✗ Cannot read from papers collection:', error.message);
    }

    // Test 3: Write to questions subcollection
    console.log('\nTest 3: Writing to questions subcollection...');
    try {
      const testQuestionRef = doc(db, 'papers', 'test_paper', 'questions', 'test_question');
      await setDoc(testQuestionRef, {
        question: 'Test question?',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
        explanation: 'Test explanation',
      });
      testResults.questionWrite = true;
      console.log('✓ Can write to questions subcollection');
    } catch (error: any) {
      testResults.errors.push(`Question write: ${error.message}`);
      console.log('✗ Cannot write to questions subcollection:', error.message);
      console.log('   This is the problem! You need to update your Firebase rules.');
    }

    // Test 4: Read from questions subcollection
    console.log('\nTest 4: Reading from questions subcollection...');
    try {
      const testQuestionRef = doc(db, 'papers', 'test_paper', 'questions', 'test_question');
      await getDoc(testQuestionRef);
      testResults.questionRead = true;
      console.log('✓ Can read from questions subcollection');
    } catch (error: any) {
      testResults.errors.push(`Question read: ${error.message}`);
      console.log('✗ Cannot read from questions subcollection:', error.message);
    }

    // Cleanup: Delete test documents
    console.log('\nCleaning up test documents...');
    try {
      await deleteDoc(doc(db, 'papers', 'test_paper', 'questions', 'test_question'));
      await deleteDoc(doc(db, 'papers', 'test_paper'));
      console.log('✓ Cleanup completed');
    } catch (error) {
      console.log('⚠️  Could not clean up test documents (not critical)');
    }

  } catch (error: any) {
    console.error('Unexpected error during testing:', error);
  }

  // Print summary
  console.log('\n=== Test Summary ===');
  console.log(`Papers - Write: ${testResults.paperWrite ? '✓' : '✗'}, Read: ${testResults.paperRead ? '✓' : '✗'}`);
  console.log(`Questions - Write: ${testResults.questionWrite ? '✓' : '✗'}, Read: ${testResults.questionRead ? '✓' : '✗'}`);

  if (testResults.errors.length > 0) {
    console.log('\n❌ Issues Found:');
    testResults.errors.forEach(err => console.log(`  - ${err}`));
    console.log('\n📝 To fix: Update your Firestore Security Rules');
    console.log('   Go to Firebase Console → Firestore Database → Rules');
    console.log('   Make sure you have this rule:');
    console.log('   match /papers/{paperId}/questions/{questionId} {');
    console.log('     allow read: if true;');
    console.log('     allow write: if request.auth != null;');
    console.log('   }');
  } else {
    console.log('\n✓ All tests passed! Rules are configured correctly.');
  }

  return testResults;
};

/**
 * Get current Firebase rules (for debugging)
 */
export const getCurrentFirebaseRulesInfo = () => {
  console.log('\n=== Firebase Rules Instructions ===\n');
  console.log('Your Firebase rules should look like this:\n');
  console.log('rules_version = \'2\';');
  console.log('service cloud.firestore {');
  console.log('  match /databases/{database}/documents {');
  console.log('');
  console.log('    match /papers/{paperId} {');
  console.log('      allow read: if true;');
  console.log('      allow write: if request.auth != null;');
  console.log('');
  console.log('      // IMPORTANT: Questions subcollection');
  console.log('      match /questions/{questionId} {');
  console.log('        allow read: if true;');
  console.log('        allow write: if request.auth != null;');
  console.log('      }');
  console.log('    }');
  console.log('');
  console.log('    match /testAttempts/{attemptId} {');
  console.log('      allow read: if request.auth != null && request.auth.uid == resource.data.userId;');
  console.log('      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;');
  console.log('    }');
  console.log('');
  console.log('    match /subscriptions/{userId} {');
  console.log('      allow read: if request.auth != null && request.auth.uid == userId;');
  console.log('      allow write: if request.auth != null && request.auth.uid == userId;');
  console.log('    }');
  console.log('  }');
  console.log('}\n');
  console.log('Copy this to: https://console.firebase.google.com');
  console.log('Project → Firestore Database → Rules → Paste → Publish\n');
};
