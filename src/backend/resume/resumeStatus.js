import { db } from "../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const EventCollection = collection(db, "userEvents");

export const resumeStatus = async (username) => {
  try {
    // Create a query to check for the username and event "resume made"
    const q = query(
      EventCollection,
      where("username", "==", username),
      where("event", "==", "resume made")
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    // If any documents are returned, the event exists
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking resume status: ", error);
    return false;
  }
};