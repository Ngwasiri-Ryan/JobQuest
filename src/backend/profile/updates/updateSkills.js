import { db } from '../../Firebase';
import { collection, query, where, getDocs, updateDoc, setDoc, doc } from 'firebase/firestore';

export const updateSkills = async (username, skills) => {
  try {
    const skillsCollection = collection(db, 'skills');

    const q = query(skillsCollection, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No document found with the provided username, creating a new one.');

      const newDocRef = doc(skillsCollection);
      await setDoc(newDocRef, { username, skills });
      return { success: true, message: 'Skills created successfully' };
    }

    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, { skills });

    return { success: true, message: 'Skills updated successfully' };
  } catch (error) {
    console.error('Error updating skills:', error);
    return { success: false, error: 'Failed to update skills' };
  }
};
