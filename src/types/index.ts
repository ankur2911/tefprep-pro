export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  audioUrl?: string; // For listening comprehension questions
}

export interface Paper {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  questionsCount: number;
  thumbnail: string;
  isPremium: boolean;
  questions?: Question[];
}

export interface TestAttempt {
  id: string;
  paperId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  answers: { [questionId: string]: number };
  completedAt: Date;
  timeSpent: number;
}

export interface UserProgress {
  userId: string;
  completedPapers: string[];
  attemptedPapers: string[];
  totalScore: number;
  averageScore: number;
}

export interface Subscription {
  id: string;
  userId: string;
  status: 'active' | 'canceled' | 'expired';
  plan: 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
}
