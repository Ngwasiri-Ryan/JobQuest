import { collection , addDoc , Timestamp} from "firebase/firestore";
import { db } from "../Firebase";

export const saveCurrentUserInfo = async ({ username, jobTitle, industry, experienceLevel, skills }) => {
    try {
      console.log("Data to be saved:", { username, jobTitle, industry, experienceLevel, skills });
  
      const currentCollection = collection(db, "current");
  
      // Saving the user data to the 'current' Firestore collection
      await addDoc(currentCollection, {
        username,
        jobTitle,
        industry,
        experienceLevel,
        skills,
        timestamp: new Date(),
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
      console.error("Error saving current user info:", error);
      return { success: false, message: error.message };
    }
  };
  