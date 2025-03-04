import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from './firebase'; // Import Firestore configuration

// Function to sign up with email, password, and role
export const signUpWithEmail = async (email, password, role = 'admin') => {
  try {
    // Create the user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Save user details in Firestore with the role
    await setDoc(doc(firestore, 'users', userId), {
      email,
      role, // Add role to the user document
    });

    return userCredential;
  } catch (error) {
    console.error('Error signing up user:', error);
    throw error; // Rethrow error to handle it in the calling function
  }
};

// Function to sign in with email and password
export const signInWithEmail = (email, password) => 
  signInWithEmailAndPassword(auth, email, password);

// Function to log out
export const logOut = () => signOut(auth);
