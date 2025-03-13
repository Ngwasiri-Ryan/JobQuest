import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { COLORS, FONTS, icons } from "../../constants";
import { saveIndependentCollections } from "../../../backend/resume/resume";
import { useUserContext } from "../../hooks/UserContext";


const initialData = [
  {
    title: "Personal Details",
    items: [
      {
        name: "",
        phone: "",
        email: "",
        country: "",
        city: "",
        town: "",
        summary: "",
      },
    ],
  },
  {
    title: "Education",
    items: [{ institution: "", degree: "", duration: "" }],
  },
  {
    title: "Work Experience",
    items: [
      {
        jobTitle: "",
        company: "",
        location: "",
        date: "",
        description: "",
      },
    ],
  },
  {
    title: "Skills",
    items: [""],
  },
  {
    title: "Certifications",
    items: [{ name: "", institute: "", duration: "" }],
  },
  {
    title: "Languages",
    items: [""],
  },
  {
    title: "Projects",
    items: [{ projectName: "", projectDescription: "" }],
  },
  {
    title: "Interests",
    items: [""],
  },
];

const ResumeMakerScreen = ({ navigation }) => {
  const { userData } = useUserContext();
  const username = userData.username;
  const [sections, setSections] = useState(initialData);

  const addItem = (sectionIndex) => {
    const newSections = [...sections];
    const currentSection = newSections[sectionIndex];
    let newItem;

    if (
      currentSection.title === "Skills" ||
      currentSection.title === "Languages" ||
      currentSection.title === "Interests"
    ) {
      newItem = "";
    } else if (currentSection.title === "Projects") {
      newItem = { projectName: "", projectDescription: "" };
    } else if (currentSection.title === "Education") {
      newItem = { institution: "", degree: "", duration: "" };
    } else if (currentSection.title === "Certifications") {
      newItem = { name: "", institution: "", duration: "" };
    } else {
      newItem = {
        jobTitle: "",
        company: "",
        location: "",
        date: "",
        description: "",
      };
    }

    currentSection.items.push(newItem);
    setSections(newSections);
  };

  const handleChange = (sectionIndex, itemIndex, field, value) => {
    const newSections = [...sections];
    const currentItem = newSections[sectionIndex].items[itemIndex];

    if (
      newSections[sectionIndex].title === "Skills" ||
      newSections[sectionIndex].title === "Languages" ||
      newSections[sectionIndex].title === "Interests"
    ) {
      newSections[sectionIndex].items[itemIndex] = value;
    } else {
      currentItem[field] = value;
    }

    setSections(newSections);
  };

  const removeItem = (sectionIndex, itemIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].items.splice(itemIndex, 1);
    setSections(newSections);
  };

  const handleSaveResume = async () => {
    const resumeData = {
      personalDetails: sections[0].items[0],
      education: sections[1].items,
      workExperience: sections[2].items,
      skills: sections[3].items,
      certifications: sections[4].items,
      languages: sections[5].items,
      projects: sections[6].items,
      interests: sections[7].items,
    };

    try {
     
      // await saveIndependentCollections(username, resumeData);
      alert("You acn now preview your resume");
      navigation.navigate('ResumePreviewScreen',{resumeData:sections})
    } catch (error) {
      console.error("Error saving resume: ", error);
      alert("Failed to save the resume. Please try again.");
    }
  };

  const renderSectionItem = ({ item, index, sectionIndex }) => {
    return (
      
      <View style={styles.itemContainer}>
        {sections[sectionIndex].title === 'Personal Details' ? (
          <>
            <TextInput
              placeholder="Name"
              value={item.name}
              onChangeText={(value) => handleChange(sectionIndex, index, 'name', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
            <TextInput
              placeholder="Phone"
              value={item.phone}
              onChangeText={(value) => handleChange(sectionIndex, index, 'phone', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              value={item.email}
              onChangeText={(value) => handleChange(sectionIndex, index, 'email', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
            <TextInput
              placeholder="Country"
              value={item.country}
              onChangeText={(value) => handleChange(sectionIndex, index, 'country', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
            <TextInput
              placeholder="City"
              value={item.city}
              onChangeText={(value) => handleChange(sectionIndex, index, 'city', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
            <TextInput
              placeholder="Town"
              value={item.town}
              onChangeText={(value) => handleChange(sectionIndex, index, 'town', value)} 
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
            <TextInput
              placeholder="Summary"
              value={item.summary || ''}
              onChangeText={(value) => handleChange(sectionIndex, index, 'summary', value)}
              placeholderTextColor={COLORS.darkgray}
              style={[styles.input, styles.descriptionInput]}
              multiline
              numberOfLines={8}
            />
          </>
        ) : sections[sectionIndex].title === 'Skills' || sections[sectionIndex].title === 'Languages' || sections[sectionIndex].title === 'Interests' ? (
          <TextInput
            placeholder={sections[sectionIndex].title}
            value={item}
            onChangeText={(value) => handleChange(sectionIndex, index, null, value)}
            placeholderTextColor={COLORS.darkgray}
            style={styles.inputSkill}
          />
        ) : sections[sectionIndex].title === 'Education' ? (
          <>
            <TextInput
              placeholder="Institution"
              value={item.institution || ''}
              onChangeText={(value) => handleChange(sectionIndex, index, 'institution', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
            <TextInput
              placeholder="Degree"
              value={item.degree || ''}
              onChangeText={(value) => handleChange(sectionIndex, index, 'degree', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
            <TextInput
              placeholder="Duration"
              value={item.duration || ''}
              onChangeText={(value) => handleChange(sectionIndex, index, 'duration', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
          </>
        ) : sections[sectionIndex].title === 'Certifications' ? (
          <>
            <TextInput
              placeholder="Certification Name"
              value={item.name || ''}
              onChangeText={(value) => handleChange(sectionIndex, index, 'name', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
            <TextInput
              placeholder="Institute"
              value={item.institute || ''}
              onChangeText={(value) => handleChange(sectionIndex, index, 'institute', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
            <TextInput
              placeholder="Duration"
              value={item.duration || ''}
              onChangeText={(value) => handleChange(sectionIndex, index, 'duration', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
            
          </>
        ) : sections[sectionIndex].title === 'Projects' ? (
          <>
            <TextInput
              placeholder="Project Name"
              value={item.projectName || ''}
              onChangeText={(value) => handleChange(sectionIndex, index, 'projectName', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
            <TextInput
              placeholder="Project Description"
              value={item.projectDescription || ''}
              onChangeText={(value) => handleChange(sectionIndex, index, 'projectDescription', value)}
              placeholderTextColor={COLORS.darkgray}
              style={[styles.input, styles.descriptionInput]}
              multiline
              numberOfLines={3}
            />
          </>
        ) : (
          <>
            <TextInput
              placeholder="Job Title"
              value={item.jobTitle || ''}
              onChangeText={(value) => handleChange(sectionIndex, index, 'jobTitle', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
            <TextInput
              placeholder="Company Name"
              value={item.company || ''}
              onChangeText={(value) => handleChange(sectionIndex, index, 'company', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
             <TextInput
              placeholder="Company Location (eg Ney York, US)"
              value={item.location || ''}
              onChangeText={(value) => handleChange(sectionIndex, index, 'location', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
            <TextInput
              placeholder="Dates (e.g. Jan 2020 - Present)"
              value={item.date || ''}
              onChangeText={(value) => handleChange(sectionIndex, index, 'date', value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={item.description || ''}
              onChangeText={(value) => handleChange(sectionIndex, index, 'description', value)}
              placeholderTextColor={COLORS.darkgray}
              style={[styles.input, styles.descriptionInput]}
              multiline
              numberOfLines={3}
            />
          </>
        )}
        <TouchableOpacity onPress={() => removeItem(sectionIndex, index)} style={styles.removeItemButton}>
          <Image style={[styles.icon, {tintColor:'red'}]} source={icons.trash} />
        </TouchableOpacity>
      </View>
    );
  };


  const renderSection = ({ item, index }) => {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleText}>{item.title}</Text>
        </View>
        <FlatList
          data={item.items}
          renderItem={(item) =>
            renderSectionItem({ ...item, sectionIndex: index })
          }
          keyExtractor={(item, idx) => idx.toString()}
        />
        <TouchableOpacity onPress={() => addItem(index)} style={styles.add}>
          <Image style={styles.icon} source={icons.add} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.back} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resume Builder</Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={sections}
          renderItem={renderSection}
          keyExtractor={(item, index) => index.toString()}
        />
        <TouchableOpacity
          onPress={handleSaveResume}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Save Resume</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20,
    backgroundColor: '#f4f4f4', // Light background color
  },
  section: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff', // White background for each section
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionHeader: {
    backgroundColor: COLORS.primary,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 5,
    backgroundColor: COLORS.white, // Make sure the background is set
    padding: 20, // Add some padding for better touch targets
    borderRadius: 10, // Optional: To give rounded corners
    ...Platform.select({
      ios: {
        shadowColor: '#000', // Color of the shadow
        shadowOffset: { width: 0, height: 2 }, // Position of the shadow
        shadowOpacity: 0.2, // Opacity of the shadow
        shadowRadius: 4, // Blur radius of the shadow
      },
      android: {
        elevation: 5, // Shadow elevation for Android
      },
    }),
  },
  introText:{
    marginBottom:20,
    ...FONTS.body3,
    ...COLORS.black,
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  makeResumeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  makeResumeButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  sectionTitleText: {
    color: '#fff', // White text for section title
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  input: {
    borderBottomWidth:1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color:COLORS.black,
  },
  inputSkill: {
    borderBottomWidth:1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color:COLORS.black
  },
  descriptionInput: {
    height: 60,
  },
  icon:{
    height:20,
    width:20,
  },
  add:{
   padding:20,
  },
  removeItemButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    margin: 10,
  },
  addButtonText: {
    marginLeft: 5,
    fontWeight: '600',
    color: COLORS.primary,
  },
  saveButton:{
    backgroundColor:COLORS.primary,
    padding:20,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
  },
  saveButtonText:{
    color:COLORS.white,
    ...FONTS.h3
  }
});



export default ResumeMakerScreen;
