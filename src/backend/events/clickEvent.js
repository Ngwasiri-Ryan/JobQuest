import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../Firebase"; // Assuming Firebase is initialized here

/**
 * Function to store click events in the Firestore collection 'userEvents'
 * @param {string} username - The username associated with the event
 * @param {string} event - The event (e.g., "view job")
 */
export const storeClickEvent = async (username) => {
  try {
    // Define the collection reference
    const eventCollection = collection(db, "userEvents");

    // Add a new document to the 'userEvents' collection
    await addDoc(eventCollection, {
      username,
      event:'click',
      timestamp: Timestamp.now(), // Store the current timestamp
    });

    console.log(`Event stored successfully for ${username}: ${event}`);
  } catch (error) {
    console.error("Error storing event:", error.message);
  }
};
