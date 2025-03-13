import { addDoc, collection , Timestamp} from "firebase/firestore";
import { db } from "../Firebase"; 

/**
 * Save personal info to the Firestore `personal` collection.
 * @param {Object} personalInfo - The personal information to save.
 * @param {string} personalInfo.name - The user's name.
 * @param {string} personalInfo.email - The user's email.
 * @param {string} personalInfo.phone - The user's phone number.
 * @param {string} personalInfo.username - The user's username.
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export const savePersonalInfo = async ({ name, email, phone, username }) => {
  try {
    const personalCollection = collection(db, "personal");

    await addDoc(personalCollection, {
      name,
      email,
      phone,
      username,
    });

     // keeping track of user events
     const EventCollection = collection(db, "userEvents");
     await addDoc(EventCollection, {
       username,
       event:'personal details',
       timestamp: Timestamp.now(),
     });

     
    return { success: true };
  } catch (error) {
    console.error("Error saving personal info:", error);
    return { success: false, message: error.message };
  }
};
