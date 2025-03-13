import { collection, query, where, getDocs , Timestamp, addDoc} from 'firebase/firestore';
import { db } from '../Firebase';

/**
 * Fetch saved jobs for a specific user.
 *
 * @param {string} username - The username of the logged-in user.
 * @returns {Promise<Array>} - A promise that resolves to an array of saved jobs.
 */
export const fetchSavedJobs = async (username) => {
  try {
    if (!username) {
      throw new Error('Username is required to fetch saved jobs.');
    }

    const savedJobsRef = collection(db, 'savedJobs');
    const q = query(savedJobsRef, where('username', '==', username));
    const snapshot = await getDocs(q);

     // keeping track of user events
     const EventCollection = collection(db, "userEvents");
     await addDoc(EventCollection, {
       username,
       event:'viewed profile',
       timestamp: Timestamp.now(),
     });

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    
  } catch (error) {
    console.error('Error fetching saved jobs:', error.message);
    throw error; // Re-throw the error for further handling if necessary
  }
};
