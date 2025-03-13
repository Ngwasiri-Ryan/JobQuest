import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

/**
 * Fetch a user's profile from Firestore by their username.
 * @param {string} username - The username to search for.
 * @returns {Promise<object>} - A promise that resolves to the user's profile data or an error object.
 */
export const fetchUserProfile = async (username) => {
  try {
    // Query the "users" collection where the username matches
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    // Check if any user exists with the given username
    if (querySnapshot.empty) {
      throw new Error("User not found");
    }

    // Assuming usernames are unique, get the first match
    const userData = querySnapshot.docs[0].data();
    return { success: true, data: userData };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: error.message };
  }
};
