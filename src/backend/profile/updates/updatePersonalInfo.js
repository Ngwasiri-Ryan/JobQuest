import { db } from '../../Firebase';
import { collection, query, where, getDocs, updateDoc, setDoc, doc } from 'firebase/firestore';

export const updatePersonalInfo = async (username, formData) => {
  try {
    // Reference the "personalDetails" collection
    const personalDetailsCollection = collection(db, 'personalDetails');

    // Query to find the document with the matching username field
    const q = query(personalDetailsCollection, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    // Check if any document matches the query
    if (querySnapshot.empty) {
      console.log('No document found with the provided username, creating a new one.');

      // Create a new document if none exists
      const newDocRef = doc(personalDetailsCollection); // Auto-generate an ID
      await setDoc(newDocRef, { ...formData, username }); // Include the username in the new document
      return { success: true, message: 'Personal information created successfully' };
    }

    // Update the first matching document
    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, formData);

    return { success: true, message: 'Personal information updated successfully' };
  } catch (error) {
    console.error('Error updating personal information:', error);
    return { success: false, error: 'Failed to update personal information' };
  }};
