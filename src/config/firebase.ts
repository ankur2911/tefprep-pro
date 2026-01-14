import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// TEFPrep Pro Firebase Project
const firebaseConfig = {
  apiKey: "AIzaSyCIZ5IsEMJKdr5Cc3QKrXhOrTkcr3nvSQc",
  authDomain: "tefprep-pro.firebaseapp.com",
  projectId: "tefprep-pro",
  storageBucket: "tefprep-pro.firebasestorage.app",
  messagingSenderId: "136999807438",
  appId: "1:136999807438:web:f282a51b9736ab7cb6239f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
