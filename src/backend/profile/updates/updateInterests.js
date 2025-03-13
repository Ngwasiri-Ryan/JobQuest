import { db } from '../../Firebase';
import { collection, query, where, getDocs, updateDoc, setDoc, doc } from 'firebase/firestore';

export const updateInterests = async (username, interests) => {
  try {
    const interestsCollection = collection(db, 'interests');

    const q = query(interestsCollection, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No document found with the provided username, creating a new one.');

      const newDocRef = doc(interestsCollection);
      await setDoc(newDocRef, { username, interests });
      return { success: true, message: 'Interests created successfully' };
    }

    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, { interests });

    return { success: true, message: 'Interests updated successfully' };
  } catch (error) {
    console.error('Error updating interests:', error);
    return { success: false, error: 'Failed to update interests' };
  }
};
