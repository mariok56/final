// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAXoOAm1Ti3B-FYDh0Ad9Fgf5YfQbkOAHc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hair-salon-6302b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hair-salon-6302b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hair-salon-6302b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "322589375344",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:322589375344:web:d9ec0516cde177b170adb5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-170DD7QM5V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize analytics only if we have all required values
let analytics;
try {
  if (firebaseConfig.projectId && firebaseConfig.appId && firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.warn('Analytics initialization failed:', error);
}

export { app, auth, analytics };