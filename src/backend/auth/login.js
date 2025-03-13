import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../Firebase";

export const loginUser = async (email, password) => {
  try {
    // Authenticate the user with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch the user document from the 'users' collection using the email
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("email", "==", email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      throw new Error("User not found in the 'users' collection.");
    }

    // Extract the username from the user document
    const userDoc = userSnapshot.docs[0];
    const username = userDoc.data().username;

    // Check if the username exists in the 'personal' collection
    const personalCollection = collection(db, "personal");
    const personalQuery = query(personalCollection, where("username", "==", username));
    const personalSnapshot = await getDocs(personalQuery);

    // Determine if the user exists in the 'personal' collection
    const isInPersonal = !personalSnapshot.empty;

    // keeping track of user events
    const EventCollection = collection(db, "userEvents");
    await addDoc(EventCollection, {
      username,
      event:'login',
      timestamp: Timestamp.now(),
    });

    // Return the result
    return { success: true, user, username, isInPersonal };
  } catch (error) {
    // Handle errors and return a descriptive message
    return { success: false, error: error.message };
  }
};
