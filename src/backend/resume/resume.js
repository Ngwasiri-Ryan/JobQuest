import { doc, setDoc, addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../Firebase"; 

export const saveIndependentCollections = async (username, resumeData) => {
  try {
    // Save personal details
    await setDoc(doc(collection(db, "personalDetails")), {
      ...resumeData.personalDetails,
      username,
    });

    // Save education details (one document per entry)
    for (const education of resumeData.education) {
      await addDoc(collection(db, "education"), {
        ...education,
        username,
      });
    }

    // Save work experience details (one document per entry)
    for (const work of resumeData.workExperience) {
      await addDoc(collection(db, "workExperience"), {
        ...work,
        username,
      });
    }

    // Save skills (single document as an array)
    await setDoc(doc(collection(db, "skills")), {
      skills: resumeData.skills,
      username,
    });

    // Save certifications (one document per entry)
    for (const certification of resumeData.certifications) {
      await addDoc(collection(db, "certifications"), {
        ...certification,
        username,
      });
    }

    // Save languages (single document as an array)
    await setDoc(doc(collection(db, "languages")), {
      languages: resumeData.languages,
      username,
    });

    // Save projects (one document per entry)
    for (const project of resumeData.projects) {
      await addDoc(collection(db, "projects"), {
        ...project,
        username,
      });
    }

    // Save interests (single document as an array)
    await setDoc(doc(collection(db, "interests")), {
      interests: resumeData.interests,
      username,
    });

     // keeping track of user events
     const EventCollection = collection(db, "userEvents");
     await addDoc(EventCollection, {
       username,
       event:'resume made',
       timestamp: Timestamp.now(),
     });

    console.log("Resume saved successfully in independent collections!");
  } catch (error) {
    console.error("Error saving resume: ", error);
  }
};
