import { db } from '../../Firebase';
import { collection, query, where, getDocs, updateDoc, setDoc, doc } from 'firebase/firestore';

export const updateExperience = async (username, experiences) => {
  try {
    // Reference the "personalDetails" collection
    const workExperience = collection(db, 'workExperience');

    // Query to find the document with the matching username field
    const q = query(workExperience, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    // Check if any document matches the query
    if (querySnapshot.empty) {
      console.log('No document found with the provided username, creating a new one.');

      // Create a new document if none exists
      const newDocRef = doc(workExperience); // Auto-generate an ID
      await setDoc(newDocRef, { username, experiences }); // Include username and experiences in the new document
      return { success: true, message: 'Experience created successfully' };
    }

    // Update the first matching document
    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, { experiences });

    return { success: true, message: 'Experience updated successfully' };
  } catch (error) {
    console.error('Error updating experience:', error);
    return { success: false, error: 'Failed to update experience' };
  }
};
