import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

/**
 * Counts the number of jobs saved by a particular user.
 *
 * @param {string} username - The username of the user whose saved jobs to count.
 * @returns {Promise<number>} - The count of saved jobs for the user.
 */
export const countSavedJobs = async (username) => {
  try {
    // Reference to the `savedJobs` collection
    const savedJobsCollection = collection(db, "savedJobs");

    // Query to filter documents where username matches the given username
    const userJobsQuery = query(savedJobsCollection, where("username", "==", username));

    // Fetch the documents matching the query
    const querySnapshot = await getDocs(userJobsQuery);

    // Count the documents
    const countSavedJobs = querySnapshot.size;

    console.log(`User ${username} has saved ${countSavedJobs} jobs.`);
    return countSavedJobs;
  } catch (error) {
    console.error("Error counting saved jobs:", error.message);
    return 0; // Return 0 if an error occurs
  }
};


