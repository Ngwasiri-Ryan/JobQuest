import { auth, db } from '../Firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc , Timestamp} from "firebase/firestore";

/**
 * Sign up a new user with email and password, then save additional user data to Firestore.
 * @param {string} username - The user's username.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} - A promise that resolves with the user data or rejects with an error.
 */
export const signUpUser = async (username, email, password) => {
  try {
    // Create a new user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data to Firestore in the "users" collection
    const usersCollection = collection(db, "users");  // Reference to "users" collection
    await addDoc(usersCollection, {
      uid: user.uid,
      password,
      username,
      email,
      createdAt: new Date().toISOString(),
    });

     // keeping track of user events
     const EventCollection = collection(db, "userEvents");
     await addDoc(EventCollection, {
       username,
       event:'sign up',
       timestamp: Timestamp.now(),
     });

    // Log to the console upon successful sign-up
    console.log('User signed up successfully:', user);

    return { success: true, user };
  } catch (error) {
    console.error("Error during sign up:", error);
    return { success: false, error: error.message };
  }
};
