import { 
    doc, 
    getDocs, 
    query, 
    where, 
    collection, 
    updateDoc 
  } from "firebase/firestore";
  import { db } from "../Firebase";
  
  /**
   * Updates the user profile in Firestore and synchronizes the username across collections.
   * @param {string} currentUsername - The current username to find the user's documents.
   * @param {object} updates - An object containing the fields to update. Must include `username` if it is being changed.
   * @returns {Promise<object>} - The result of the update operation.
   */
  export const updateUserProfile = async (currentUsername, updates) => {
    try {
      const collectionsToUpdate = [
        "users",
        "appliedJobs",
        "savedJobs",
        "personalDetails",
        "userEvents",
        "education",
        "languages",
        "skills",
        "projects",
        "chatHistory",
        "userLogins",
        "current",
        "workExperience",
        "interests",
        "certifications",
        "viewedJobs",
        "searchHistory",
        "personal",
      ];
  
      const newUsername = updates.username; // Extract the new username if provided
      const isUsernameUpdated = newUsername && currentUsername !== newUsername;
  
      if (!isUsernameUpdated) {
        // Update only the user-specific fields if username isn't changing
        const usersCollection = collection(db, "users");
        const userQuery = query(usersCollection, where("username", "==", currentUsername));
        const querySnapshot = await getDocs(userQuery);
  
        if (querySnapshot.empty) {
          return { success: false, message: "User not found." };
        }
  
        const userDocRef = querySnapshot.docs[0].ref;
        await updateDoc(userDocRef, updates);
  
        return { success: true, message: "Profile updated successfully." };
      }
  
      // Update username across all collections
      for (const collectionName of collectionsToUpdate) {
        const collectionRef = collection(db, collectionName);
        const collectionQuery = query(collectionRef, where("username", "==", currentUsername));
        const querySnapshot = await getDocs(collectionQuery);
  
        for (const docSnap of querySnapshot.docs) {
          const docRef = docSnap.ref;
          await updateDoc(docRef, { username: newUsername });
        }
      }
  
      // Update user-specific fields in "users" collection
      const usersCollection = collection(db, "users");
      const userQuery = query(usersCollection, where("username", "==", currentUsername));
      const querySnapshot = await getDocs(userQuery);
  
      if (querySnapshot.empty) {
        return { success: false, message: "User not found." };
      }
  
      const userDocRef = querySnapshot.docs[0].ref;
      await updateDoc(userDocRef, updates);
  
      return { success: true, message: "Profile and username updated successfully across collections." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  