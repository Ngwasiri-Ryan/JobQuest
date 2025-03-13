import { db } from '../../Firebase';
import { collection, query, where, getDocs, updateDoc, setDoc, doc } from 'firebase/firestore';

export const updateCertification = async (username, certifications) => {
  try {
    const certificationCollection = collection(db, 'certifications');

    const q = query(certificationCollection, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No document found with the provided username, creating a new one.');

      const newDocRef = doc(certificationCollection);
      await setDoc(newDocRef, { username, certifications });
      return { success: true, message: 'Certifications created successfully' };
    }

    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, { certifications });

    return { success: true, message: 'Certifications updated successfully' };
  } catch (error) {
    console.error('Error updating certifications:', error);
    return { success: false, error: 'Failed to update certifications' };
  }
};
