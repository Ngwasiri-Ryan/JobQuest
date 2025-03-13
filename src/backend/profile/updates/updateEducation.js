import { db } from '../../Firebase';
import { collection, query, where, getDocs, updateDoc, setDoc, doc } from 'firebase/firestore';

export const updateEducation = async (username, education) => {
  try {
    const educationCollection = collection(db, 'education');

    const q = query(educationCollection, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No document found with the provided username, creating a new one.');

      const newDocRef = doc(educationCollection);
      await setDoc(newDocRef, { username, education });
      return { success: true, message: 'Education created successfully' };
    }

    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, { education });

    return { success: true, message: 'Education updated successfully' };
  } catch (error) {
    console.error('Error updating education:', error);
    return { success: false, error: 'Failed to update education' };
  }
};
