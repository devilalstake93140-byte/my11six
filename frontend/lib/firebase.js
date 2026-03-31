/**
 * Firebase Configuration
 * Setup for Google and Email authentication
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration from user provided config
const firebaseConfig = {
  apiKey: "AIzaSyDx4wsjWNTFwyMjVEGSVmiyje63TuIoHRQ",
  authDomain: "crushrr-42ac7.firebaseapp.com",
  projectId: "crushrr-42ac7",
  storageBucket: "crushrr-42ac7.firebasestorage.app",
  messagingSenderId: "608897648840",
  appId: "1:608897648840:web:ade71df5c222a2dff2fdfd",
  measurementId: "G-NKTCHYDR02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth instance
export const auth = getAuth(app);

export default app;