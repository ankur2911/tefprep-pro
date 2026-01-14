import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { TestAttempt } from '../types';

export const testAttemptService = {
  // Save test attempt
  async saveAttempt(attempt: Omit<TestAttempt, 'id'>): Promise<string> {
    try {
      const attemptsRef = collection(db, 'test_attempts');
      const docRef = await addDoc(attemptsRef, {
        ...attempt,
        completedAt: Timestamp.fromDate(attempt.completedAt),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving test attempt:', error);
      throw error;
    }
  },

  // Get user's test attempts
  async getUserAttempts(userId: string): Promise<TestAttempt[]> {
    try {
      const attemptsRef = collection(db, 'test_attempts');
      const q = query(
        attemptsRef,
        where('userId', '==', userId),
        orderBy('completedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt.toDate(),
      } as TestAttempt));
    } catch (error) {
      console.error('Error fetching user attempts:', error);
      throw error;
    }
  },

  // Get attempts for specific paper
  async getPaperAttempts(userId: string, paperId: string): Promise<TestAttempt[]> {
    try {
      const attemptsRef = collection(db, 'test_attempts');
      const q = query(
        attemptsRef,
        where('userId', '==', userId),
        where('paperId', '==', paperId),
        orderBy('completedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt.toDate(),
      } as TestAttempt));
    } catch (error) {
      console.error('Error fetching paper attempts:', error);
      throw error;
    }
  },

  // Calculate user statistics
  calculateStats(attempts: TestAttempt[]) {
    if (attempts.length === 0) {
      return {
        totalTests: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
      };
    }

    // Filter out invalid attempts (where totalQuestions is 0 or undefined)
    const validAttempts = attempts.filter(
      attempt => attempt.totalQuestions && attempt.totalQuestions > 0
    );

    if (validAttempts.length === 0) {
      return {
        totalTests: attempts.length,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: Math.round(
          attempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0) / 60
        ),
      };
    }

    const totalTests = attempts.length;
    const totalScore = validAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
    const totalQuestions = validAttempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
    const averageScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;
    const percentages = validAttempts.map(a => (a.score / a.totalQuestions) * 100);
    const bestScore = percentages.length > 0 ? Math.max(...percentages) : 0;
    const totalTimeSpent = attempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0);

    return {
      totalTests,
      averageScore: Math.round(averageScore),
      bestScore: Math.round(bestScore),
      totalTimeSpent: Math.round(totalTimeSpent / 60), // in minutes
    };
  },
};
