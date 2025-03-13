import { db } from '../Firebase';
import { addDoc, collection  , query,where, getDocs , Timestamp} from "firebase/firestore";

/**
 * Save a message to Firestore chat history
 * @param {string} username - The username of the person sending the message
 * @param {string} message - The content of the message
 */
export const saveChatHistory = async (username, message) => {
  try {
    const chatHistoryRef = collection(db, 'chatHistory');

    // Add the message document to Firestore
    await addDoc(chatHistoryRef, {
      username: username,
      message: message,
      timestamp: Timestamp.fromDate(new Date()),  // Store the current date and time
    });

     // keeping track of user events
     const EventCollection = collection(db, "userEvents");
     await addDoc(EventCollection, {
       username,
       event:'chat',
       timestamp: Timestamp.now(),
     });

    console.log('Chat message saved successfully!');
  } catch (error) {
    console.error('Error saving chat message: ', error);
  }
};

/**
 * Get the total number of searches (messages) for a particular user
 * @param {string} username - The username of the user for whom you want to count the messages
 * @returns {number} - The total number of messages for the user
 */

export const getUserChatSearchCount = async (username) => {
  try {
    const chatHistoryRef = collection(db, 'chatHistory');
    
    // Create a query to find all messages by the given user
    const q = query(chatHistoryRef, where('username', '==', username));

    // Get the query snapshot
    const querySnapshot = await getDocs(q);

    // Return the number of documents (messages) for the user
   const chatCount =   querySnapshot.size

    return chatCount;
  } catch (error) {
    console.error('Error getting search count: ', error);
    return 0; // Return 0 in case of an error
  }
};
