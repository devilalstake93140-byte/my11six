/**
 * Firebase Authentication Helper Functions
 * Handles Google Sign-In and Email/Password authentication
 */

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';

// Google Provider
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google
 * @returns {object} User credentials and ID token
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    
    return {
      success: true,
      user: {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL
      },
      idToken
    };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Sign up with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User display name
 * @returns {object} User credentials and ID token
 */
export const signUpWithEmail = async (email, password, name) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    if (name) {
      await updateProfile(result.user, { displayName: name });
    }
    
    const idToken = await result.user.getIdToken();
    
    return {
      success: true,
      user: {
        uid: result.user.uid,
        email: result.user.email,
        name: name || result.user.displayName,
        photoURL: result.user.photoURL
      },
      idToken
    };
  } catch (error) {
    console.error('Email Sign-Up Error:', error);
    return {
      success: false,
      error: getFriendlyError(error.code)
    };
  }
};

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object} User credentials and ID token
 */
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await result.user.getIdToken();
    
    return {
      success: true,
      user: {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL
      },
      idToken
    };
  } catch (error) {
    console.error('Email Sign-In Error:', error);
    return {
      success: false,
      error: getFriendlyError(error.code)
    };
  }
};

/**
 * Sign out
 * @returns {boolean} Success status
 */
export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign Out Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Convert Firebase error codes to user-friendly messages
 */
const getFriendlyError = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/weak-password': 'Password is too weak (minimum 6 characters)',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/popup-closed-by-user': 'Sign-in was cancelled',
    'auth/account-exists-with-different-credential': 'An account already exists with a different sign-in method'
  };
  
  return errorMessages[errorCode] || 'An error occurred. Please try again';
};

export default {
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
  logOut
};