import { db } from '../../Firebase';
import { collection, query, where, getDocs, updateDoc, setDoc, doc } from 'firebase/firestore';

export const updateLanguages = async (username, languages) => {
  try {
    const languagesCollection = collection(db, 'languages');

    const q = query(languagesCollection, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No document found with the provided username, creating a new one.');

      const newDocRef = doc(languagesCollection);
      await setDoc(newDocRef, { username, languages });
      return { success: true, message: 'Languages created successfully' };
    }

    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, { languages });

    return { success: true, message: 'Languages updated successfully' };
  } catch (error) {
    console.error('Error updating languages:', error);
    return { success: false, error: 'Failed to update languages' };
  }
};
