import { db } from '../../Firebase';
import { collection, query, where, getDocs, updateDoc, setDoc, doc } from 'firebase/firestore';

export const updateProject = async (username, projects) => {
  try {
    const projectCollection = collection(db, 'projects');
    const q = query(projectCollection, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No document found, creating a new one.');
      const newDocRef = doc(projectCollection);
      await setDoc(newDocRef, { username, projects });
      return { success: true, message: 'Projects created successfully' };
    }

    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, { projects });

    return { success: true, message: 'Projects updated successfully' };
  } catch (error) {
    console.error('Error updating projects:', error);
    return { success: false, error: 'Failed to update projects' };
  }
};
