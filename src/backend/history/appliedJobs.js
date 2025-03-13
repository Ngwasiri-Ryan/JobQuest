import { addDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../Firebase";

/**
 * Saves a job to the Firestore collection `appliedJobs`.
 * 
 * @param {Object} jobData - The data of the job to save.
 * @param {string} username - The username of the logged-in user.
 */
export const saveAppliedJob = async (jobData, username) => {
  try {
    // Reference to the `appliedJobs` collection
    const appliedJobsCollection = collection(db, "appliedJobs");

    await addDoc(appliedJobsCollection, {
      ...jobData, // Spread all job properties
      username,   // Add the username
      appliedAt: new Date().toISOString(),
    });

    // Keeping track of user events
    const EventCollection = collection(db, "userEvents");
    await addDoc(EventCollection, {
      username,
      event: 'applied for job',
      timestamp: Timestamp.now(),
    });

    console.log("Job apply successfully.");
  } catch (error) {
    console.error("Error saving job:", error.message);
  }
};

/**
 * Fetches all applied jobs for a specific user.
 * 
 * @param {string} username - The username of the logged-in user.
 * @returns {Array} - An array of job objects.
 */
export const fetchAppliedJobs = async (username) => {
  try {
    // Reference to the `appliedJobs` collection
    const appliedJobsCollection = collection(db, "appliedJobs");

    // Create a query to get the jobs where the username matches
    const appliedJobsQuery = query(appliedJobsCollection, where("username", "==", username));

    // Execute the query
    const querySnapshot = await getDocs(appliedJobsQuery);

    // Map through the documents and return the data
    const appliedJobs = querySnapshot.docs.map(doc => ({
      id: doc.id, // Document ID
      ...doc.data(), // Document data
    }));

    return appliedJobs; // Return the list of applied jobs
  } catch (error) {
    console.error("Error fetching applied jobs:", error.message);
    return []; // Return an empty array if there's an error
  }
};

/**
 * Gets the number of applied jobs for a specific user.
 * 
 * @param {string} username - The username of the logged-in user.
 * @returns {number} - The count of applied jobs.
 */
export const getNumberOfAppliedJobs = async (username) => {
  try {
    // Reference to the `appliedJobs` collection
    const appliedJobsCollection = collection(db, "appliedJobs");

    // Create a query to get the jobs where the username matches
    const appliedJobsQuery = query(appliedJobsCollection, where("username", "==", username));

    // Execute the query
    const querySnapshot = await getDocs(appliedJobsQuery);

    // Return the count of applied jobs
    return querySnapshot.size; // The size of the snapshot represents the number of documents
  } catch (error) {
    console.error("Error fetching applied jobs:", error.message);
    return 0; // Return 0 if there's an error
  }
};
