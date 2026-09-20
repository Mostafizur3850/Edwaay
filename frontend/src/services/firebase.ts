import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Support reading environment variables or Admin Panel dynamic local storage
const getFirebaseConfig = () => {
  // Check if admin updated Firebase keys dynamically in Admin Panel
  try {
    const adminSavedConfig = localStorage.getItem('takeuup_firebase_config');
    if (adminSavedConfig) {
      const parsed = JSON.parse(adminSavedConfig);
      if (parsed.apiKey && parsed.apiKey.length > 10) {
        return parsed;
      }
    }
  } catch (e) {}

  // Helper for reading Vite env or process env
  const getEnv = (viteKey: string, fallback: string) => {
    try {
      const metaAny = import.meta as any;
      if (metaAny && metaAny.env && metaAny.env[viteKey]) {
        return metaAny.env[viteKey];
      }
    } catch (e) {}
    return fallback;
  };

  // Exact live Firebase credentials from user screenshot
  return {
    apiKey: getEnv('VITE_FIREBASE_API_KEY', 'AIzaSyBVKOOG6tiAWdUp6W2h-FfOJnBY4yatpX8'),
    authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN', 'takeuup-web.firebaseapp.com'),
    projectId: getEnv('VITE_FIREBASE_PROJECT_ID', 'takeuup-web'),
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET', 'takeuup-web.firebasestorage.app'),
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', '184600223693'),
    appId: getEnv('VITE_FIREBASE_APP_ID', '1:184600223693:web:db4fcf763f87654d22ae84'),
    measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID', 'G-J29Z4FEFZE')
  };
};

const firebaseConfig = getFirebaseConfig();

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Helper for Mock Data
export const MOCK_USER = {
  uid: 'user123',
  email: 'student@example.com',
  displayName: 'You',
  photoURL: 'https://picsum.photos/200',
  role: 'student',
  plan: 'free',
  streak: 5,
  points: 10980
};