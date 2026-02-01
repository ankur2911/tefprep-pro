import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

// Use Constants.expoConfig.extra for runtime environment variables
const FIREBASE_API_KEY = Constants.expoConfig?.extra?.FIREBASE_API_KEY || '';
const FIREBASE_AUTH_DOMAIN = Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN || '';
const FIREBASE_PROJECT_ID = Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID || '';
const FIREBASE_STORAGE_BUCKET = Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET || '';
const FIREBASE_MESSAGING_SENDER_ID = Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID || '';
const FIREBASE_APP_ID = Constants.expoConfig?.extra?.FIREBASE_APP_ID || '';

// Firebase configuration
// TEFPrep Pro Firebase Project
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
