import { db } from '../Firebase'; 
import { addDoc, collection  , query,where, getDocs ,  Timestamp} from "firebase/firestore";

export const saveSearchHistory = async (username, query) => {
  try {
    const searchHistoryRef = collection(db, 'searchHistory');

    // Add the search history document
    await addDoc(searchHistoryRef, {
      username: username,
      date: Timestamp.fromDate(new Date()),  // Store the current date and time
      query: query,
    });

     // keeping track of user events
     const EventCollection = collection(db, "userEvents");
     await addDoc(EventCollection, {
       username,
       event:'search',
       timestamp: Timestamp.now(),
     });

    console.log('Search history saved successfully!');
  } catch (error) {
    console.error('Error saving search history: ', error);
  }
};

export const countUserSearches = async (username) => {
    try {
      const searchHistoryRef = collection(db, 'searchHistory');
      
      // Query to count the number of searches for the given username
      const q = query(searchHistoryRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
  
      // The size of the query snapshot will give the number of documents (searches) for the username
      const searchCount = querySnapshot.size;
  
      console.log(`User ${username} has searched ${searchCount} times.`);
      return searchCount;  // Return the count
    } catch (error) {
      console.error('Error counting user searches: ', error);
      return 0;  // In case of error, return 0 searches
    }
  };
