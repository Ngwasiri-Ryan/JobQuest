import { addDoc, collection  , query,where, getDocs , Timestamp} from "firebase/firestore";
import { db } from "../Firebase";
/**
 * Saves a job to the Firestore collection `savedJobs`.
 * 
 * @param {Object} jobData - The data of the job to save.
 * @param {string} username - The username of the logged-in user.
 */
export const ViewedJob = async (jobData, username) => {
  try {
    // Reference to the `savedJobs` collection
    const viewedJobsCollection = collection(db, "viewedJobs");

    
    await addDoc(viewedJobsCollection, {
      ...jobData, // Spread all job properties
      username,   // Add the username
      savedAt: new Date().toISOString(), 
    });

     // keeping track of user events
     const EventCollection = collection(db, "userEvents");
     await addDoc(EventCollection, {
       username,
       event:'view job',
       timestamp: Timestamp.now(),
     });

    console.log("Viewd job saved successfully.");
  } catch (error) {
    console.error("Error saving job:", error.message);
  }
};

export const getViewedJobCount = async (username) => {
  try {
    const viewedJobsCollection = collection(db, "viewedJobs");

    // Create a query to find all viewed jobs by the given user
    const q = query(viewedJobsCollection, where("username", "==", username));

    // Get the query snapshot
    const querySnapshot = await getDocs(q);

    // Return the number of documents (viewed jobs) for the user
    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting viewed job count:", error.message);
    return 0; // Return 0 in case of an error
  }
};