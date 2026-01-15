import { doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MOCK_PAPERS, MOCK_QUESTIONS } from '../utils/mockData';

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Upload all mock papers and questions to Firebase
 * This script will:
 * 1. Upload all papers with their original IDs
 * 2. Add questions to each paper as a subcollection
 * 3. Add delays to avoid bandwidth limits
 */
export const uploadMockDataToFirebase = async () => {
  try {
    console.log('Starting upload of mock data to Firebase...');
    console.log('This will take a few minutes to avoid bandwidth limits...\n');

    let uploadedPapers = 0;
    let uploadedQuestions = 0;
    const errors: string[] = [];

    // Upload papers one at a time with delays
    for (let i = 0; i < MOCK_PAPERS.length; i++) {
      const paper = MOCK_PAPERS[i];

      try {
        // Use the paper's ID as the document ID
        const paperRef = doc(db, 'papers', paper.id);

        // Upload paper data (without questions array)
        await setDoc(paperRef, {
          title: paper.title,
          description: paper.description,
          category: paper.category,
          difficulty: paper.difficulty,
          duration: paper.duration,
          questionsCount: paper.questionsCount,
          thumbnail: paper.thumbnail,
          isPremium: paper.isPremium,
        });

        uploadedPapers++;
        console.log(`✓ [${i + 1}/${MOCK_PAPERS.length}] Uploaded paper ${paper.id}: ${paper.title}`);

        // Add delay after paper upload
        await delay(500);

        // Upload questions for this paper if they exist
        const questions = MOCK_QUESTIONS[paper.id];
        if (questions && questions.length > 0) {
          // Upload questions in smaller batches to avoid limits
          const BATCH_SIZE = 10;
          let questionBatchCount = 0;

          for (let j = 0; j < questions.length; j += BATCH_SIZE) {
            const batch = writeBatch(db);
            const questionBatch = questions.slice(j, j + BATCH_SIZE);

            questionBatch.forEach((question) => {
              const questionRef = doc(db, 'papers', paper.id, 'questions', question.id);
              batch.set(questionRef, {
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
              });
            });

            await batch.commit();
            questionBatchCount += questionBatch.length;

            // Add delay between question batches
            await delay(300);
          }

          uploadedQuestions += questionBatchCount;
          console.log(`  ✓ Uploaded ${questionBatchCount} questions for paper ${paper.id}`);
        }

        // Add delay between papers
        await delay(800);

      } catch (error: any) {
        const errorMsg = `Paper ${paper.id}: ${error?.message || 'Unknown error'}`;
        errors.push(errorMsg);
        console.error(`✗ Error uploading paper ${paper.id}:`, error?.message || error);

        // If bandwidth error, wait longer before continuing
        if (error?.code === 'resource-exhausted') {
          console.log('  ⏳ Bandwidth limit hit, waiting 5 seconds...');
          await delay(5000);
        }
      }
    }

    console.log('\n=== Upload Summary ===');
    console.log(`Papers uploaded: ${uploadedPapers}/${MOCK_PAPERS.length}`);
    console.log(`Questions uploaded: ${uploadedQuestions}`);

    if (errors.length > 0) {
      console.log(`\n⚠️  Errors encountered: ${errors.length}`);
      errors.forEach(err => console.log(`  - ${err}`));
    } else {
      console.log('✓ Upload completed successfully!');
    }

    return {
      success: errors.length === 0,
      papersUploaded: uploadedPapers,
      questionsUploaded: uploadedQuestions,
      errors: errors.length,
    };
  } catch (error) {
    console.error('Error uploading mock data:', error);
    throw error;
  }
};

/**
 * Delete all papers and questions from Firebase
 * Use with caution!
 */
export const clearFirebaseData = async () => {
  try {
    console.log('Clearing all papers from Firebase...');
    const { getDocs, collection, deleteDoc } = await import('firebase/firestore');

    const papersRef = collection(db, 'papers');
    const snapshot = await getDocs(papersRef);

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Deleted ${snapshot.docs.length} papers`);

    return { success: true, deleted: snapshot.docs.length };
  } catch (error) {
    console.error('Error clearing Firebase data:', error);
    throw error;
  }
};
