import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Paper, Question } from '../types';

export const paperService = {
  // Get all papers
  async getAllPapers(): Promise<Paper[]> {
    try {
      const papersRef = collection(db, 'papers');
      const snapshot = await getDocs(papersRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Paper));
    } catch (error) {
      console.error('Error fetching papers:', error);
      throw error;
    }
  },

  // Get paper by ID
  async getPaperById(paperId: string): Promise<Paper | null> {
    try {
      const paperRef = doc(db, 'papers', paperId);
      const snapshot = await getDoc(paperRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Paper;
      }
      return null;
    } catch (error) {
      console.error('Error fetching paper:', error);
      throw error;
    }
  },

  // Get papers by category
  async getPapersByCategory(category: string): Promise<Paper[]> {
    try {
      const papersRef = collection(db, 'papers');
      const q = query(papersRef, where('category', '==', category));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Paper));
    } catch (error) {
      console.error('Error fetching papers by category:', error);
      throw error;
    }
  },

  // Add new paper
  async addPaper(paper: Omit<Paper, 'id'>): Promise<string> {
    try {
      const papersRef = collection(db, 'papers');
      const docRef = await addDoc(papersRef, paper);
      return docRef.id;
    } catch (error) {
      console.error('Error adding paper:', error);
      throw error;
    }
  },

  // Update paper
  async updatePaper(paperId: string, updates: Partial<Paper>): Promise<void> {
    try {
      const paperRef = doc(db, 'papers', paperId);
      await updateDoc(paperRef, updates);
    } catch (error) {
      console.error('Error updating paper:', error);
      throw error;
    }
  },

  // Delete paper
  async deletePaper(paperId: string): Promise<void> {
    try {
      const paperRef = doc(db, 'papers', paperId);
      await deleteDoc(paperRef);
    } catch (error) {
      console.error('Error deleting paper:', error);
      throw error;
    }
  },

  // Add questions to paper
  async addQuestionsToPaper(paperId: string, questions: Question[]): Promise<void> {
    try {
      const paperRef = doc(db, 'papers', paperId);
      await updateDoc(paperRef, { questions });
    } catch (error) {
      console.error('Error adding questions:', error);
      throw error;
    }
  },

  // Get questions for a paper from subcollection
  async getQuestionsForPaper(paperId: string): Promise<Question[]> {
    try {
      const questionsRef = collection(db, 'papers', paperId, 'questions');
      const snapshot = await getDocs(questionsRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Question));
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },
};
