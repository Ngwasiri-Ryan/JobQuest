import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

/**
 * Fetches the saved jobs from the Firestore collection `appliedJobs` for the logged-in user.
 * 
 * @param {string} username - The username of the logged-in user.
 * @returns {Array} - An array of job objects.
 */
export const fetchSavedJobs = async (username) => {
  try {
    // Reference to the `appliedJobs` collection
    const appliedJobsCollection = collection(db, "appliedJobs");

    // Create a query to get the jobs where the username matches
    const savedJobsQuery = query(appliedJobsCollection, where("username", "==", username));

    // Execute the query
    const querySnapshot = await getDocs(savedJobsQuery);

    // Create an array to hold the jobs
    const savedJobs = [];

    // Loop through the querySnapshot and add each document to the savedJobs array
    querySnapshot.forEach(doc => {
      savedJobs.push({
        id: doc.id,
        ...doc.data(),  // Spread the document data
      });
    });

    return savedJobs;  // Return the array of saved jobs
  } catch (error) {
    console.error("Error fetching saved jobs:", error.message);
    return [];  // Return an empty array in case of error
  }
};
