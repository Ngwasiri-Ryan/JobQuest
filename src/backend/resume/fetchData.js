import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

export const fetchResumeData = async (username) => {
  try {
    const personalDetailsSnapshot = await getDocs(
      query(collection(db, "personalDetails"), where("username", "==", username))
    );

    const educationSnapshot = await getDocs(
      query(collection(db, "education"), where("username", "==", username))
    );

    const workExperienceSnapshot = await getDocs(
      query(collection(db, "workExperience"), where("username", "==", username))
    );

    const skillsSnapshot = await getDocs(
      query(collection(db, "skills"), where("username", "==", username))
    );

    const languagesSnapshot = await getDocs(
        query(collection(db, "languages"), where("username", "==", username))
      );

    const certificationsSnapshot = await getDocs(
      query(collection(db, "certifications"), where("username", "==", username))
    );

    return {
      personalDetails: personalDetailsSnapshot.docs.map((doc) => doc.data())[0],
      education: educationSnapshot.docs.map((doc) => doc.data()),
      workExperience: workExperienceSnapshot.docs.map((doc) => doc.data()),
      skills: skillsSnapshot.docs.map((doc) => doc.data()[0]?.skills || []),
      languages: languagesSnapshot.docs.map((doc) => doc.data()[0]?.skills || []),
      certifications: certificationsSnapshot.docs.map((doc) => doc.data()),
    };
  } catch (error) {
    console.error("Error fetching resume data:", error);
    throw error;
  }
};
