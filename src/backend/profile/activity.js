import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase"; 

// Function to check if username exists in a collection
const usernameExistsInCollection = async (collectionName, username) => {
  try {
    const q = query(collection(db, collectionName), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Returns true if username exists, false if not
  } catch (error) {
    console.error(`Error checking username in ${collectionName}:`, error);
    return false; // Return false in case of error
  }
};

// Function to fetch user details and check activity across collections
export const fetchUserActivity = async (username) => {
  
  const collections = [
    "personalDetails",
    "education",
    "workExperience",
    "skills",
    "certifications",
    "languages",
    "projects",
    "interests",
    "personal",
    "current",
  ];

  // Check if username exists in all collections
  for (let collectionName of collections) {
    const exists = await usernameExistsInCollection(collectionName, username);
    if (!exists) {
      return false; // Return false if username is not found in any of the collections
    }
  }

  return true; // Return true if username exists in all collections
};

// // Example usage
// const usernameToCheck = "johndoe";
// fetchUserActivity(usernameToCheck)
//   .then((exists) => {
//     if (exists) {
//       console.log(`Username ${usernameToCheck} exists in all collections.`);
//     } else {
//       console.log(`Username ${usernameToCheck} is missing in one or more collections.`);
//     }
//   })
//   .catch((error) => {
//     console.error("Error checking username activity:", error);
//   });
