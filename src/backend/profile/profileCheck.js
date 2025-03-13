
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

export const profileCheck = async (username) => {
  try {
    // Check if the username exists in the 'personal' collection
    const personalCollection = collection(db, "personal");
    const personalQuery = query(personalCollection, where("username", "==", username));
    const personalSnapshot = await getDocs(personalQuery);

    
    const isInPersonal = !personalSnapshot.empty;

    // Return the result
    return { success: true, isInPersonal };
  } catch (error) {
    // Handle errors and return a descriptive message
    return { success: false, isInPersonal: false, error: error.message };
  }
};