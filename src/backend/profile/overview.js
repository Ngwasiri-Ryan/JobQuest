import { collection, query, where, getDocs , Timestamp ,  addDoc} from "firebase/firestore";
import { db } from "../Firebase"; // Adjust the path to your firebase configuration

export const fetchuserDetails = async (username) => {
  const data = {};

  try {
    // Fetch personal details
    const personalDetailsQuery = query(
      collection(db, "personalDetails"),
      where("username", "==", username)
    );
    const personalDetailsSnapshot = await getDocs(personalDetailsQuery);
    data.personalDetails = personalDetailsSnapshot.docs.map((doc) => doc.data())[0];

    // Fetch education details
    const educationQuery = query(
      collection(db, "education"),
      where("username", "==", username)
    );
    const educationSnapshot = await getDocs(educationQuery);
    data.education = educationSnapshot.docs.map((doc) => doc.data());

    // Fetch work experience
    const workExperienceQuery = query(
      collection(db, "workExperience"),
      where("username", "==", username)
    );
    const workExperienceSnapshot = await getDocs(workExperienceQuery);
    data.workExperience = workExperienceSnapshot.docs.map((doc) => doc.data());

    // Fetch skills
    const skillsQuery = query(
      collection(db, "skills"),
      where("username", "==", username)
    );
    const skillsSnapshot = await getDocs(skillsQuery);
    data.skills = skillsSnapshot.docs.map((doc) => doc.data())[0]?.skills || [];

    // Fetch certifications
    const certificationsQuery = query(
      collection(db, "certifications"),
      where("username", "==", username)
    );
    const certificationsSnapshot = await getDocs(certificationsQuery);
    data.certifications = certificationsSnapshot.docs.map((doc) => doc.data());

    // Fetch languages
    const languagesQuery = query(
      collection(db, "languages"),
      where("username", "==", username)
    );
    const languagesSnapshot = await getDocs(languagesQuery);
    data.languages = languagesSnapshot.docs.map((doc) => doc.data())[0]?.languages || [];

    // Fetch projects
    const projectsQuery = query(
      collection(db, "projects"),
      where("username", "==", username)
    );
    const projectsSnapshot = await getDocs(projectsQuery);
    data.projects = projectsSnapshot.docs.map((doc) => doc.data());

    // Fetch interests
    const interestsQuery = query(
      collection(db, "interests"),
      where("username", "==", username)
    );
    const interestsSnapshot = await getDocs(interestsQuery);
    data.interests = interestsSnapshot.docs.map((doc) => doc.data())[0]?.interests || [];
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  // Fetch personal
  const personalQuery = query(
    collection(db, "personal"),
    where("username", "==", username)
  );
  const personalSnapshot = await getDocs(personalQuery);
  data.personal = personalSnapshot.docs.map((doc) => doc.data())[0];

  
  // Fetch current
  const currentQuery = query(
    collection(db, "current"),
    where("username", "==", username)
  );
  const currentSnapshot = await getDocs(currentQuery);
  data.current = currentSnapshot.docs.map((doc) => doc.data())[0];

  return data;
};
