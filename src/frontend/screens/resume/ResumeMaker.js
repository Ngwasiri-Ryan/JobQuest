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

  const defaultItems = {
    Skills: "",
    Languages: "",
    Interests: "",
    Projects: { projectName: "", projectDescription: "" },
    Education: { institution: "", degree: "", duration: "" },
    Certifications: { name: "", institute: "", duration: "" },
    "Work Experience": { jobTitle: "", company: "", location: "", date: "", description: "" },
  };
  
  const addItem = (sectionIndex) => {
    setSections((prevSections) => {
      return prevSections.map((section, sIndex) => {
        if (sIndex !== sectionIndex) return section;
  
        let newItem;
        if (["Skills", "Languages", "Interests"].includes(section.title)) {
          newItem = "";
        } else if (section.title === "Projects") {
          newItem = { projectName: "", projectDescription: "" };
        } else if (section.title === "Education") {
          newItem = { institution: "", degree: "", duration: "" };
        } else if (section.title === "Certifications") {
          newItem = { name: "", institute: "", duration: "" };
        } else {
          newItem = {
            jobTitle: "",
            company: "",
            location: "",
            date: "",
            description: "",
          };
        }
  
        return { ...section, items: [...section.items, newItem] };
      });
    });
  };
  

  const handleChange = (sectionIndex, itemIndex, field, value) => {
    setSections((prevSections) => {
      return prevSections.map((section, sIndex) => {
        if (sIndex !== sectionIndex) return section; // Keep other sections unchanged
  
        return {
          ...section,
          items: section.items.map((item, iIndex) => {
            if (iIndex !== itemIndex) return item; // Keep other items unchanged
  
            if (typeof item === "string") {
              return value; // Handle text arrays like Skills, Interests, Languages
            } else {
              return { ...item, [field]: value }; // Update the field correctly
            }
          }),
        };
      });
    });
  };
  
  const removeItem = (sectionIndex, itemIndex) => {
    setSections((prevSections) => {
      return prevSections.map((section, sIndex) => {
        if (sIndex !== sectionIndex) return section;
  
        return {
          ...section,
          items: section.items.filter((_, iIndex) => iIndex !== itemIndex),
        };
      });
    });
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
            {[
              { key: 'name', placeholder: 'Name', icon: icons.user },
              { key: 'phone', placeholder: 'Phone', icon: icons.phone },
              { key: 'email', placeholder: 'Email', icon: icons.mail },
              { key: 'country', placeholder: 'Country', icon: icons.globe },
              { key: 'city', placeholder: 'City', icon: icons.location },
              { key: 'town', placeholder: 'Town', icon: icons.town },
            ].map(({ key, placeholder, icon }) => (
              <View key={key} style={styles.inputRow}>
                <Image source={icon} style={styles.inputIcon} />
                <TextInput
                  placeholder={placeholder}
                  value={item[key]}
                  onChangeText={(value) => handleChange(sectionIndex, index, key, value)}
                  placeholderTextColor={COLORS.darkgray}
                  style={styles.input}
                />
              </View>
            ))}
            <View style={styles.inputRow}>
              <Image source={icons.pen} style={styles.inputIcon} />
              <TextInput
                placeholder="Summary"
                value={item.summary || ''}
                onChangeText={(value) => handleChange(sectionIndex, index, 'summary', value)}
                placeholderTextColor={COLORS.darkgray}
                style={[styles.input, styles.descriptionInput]}
                multiline
                numberOfLines={8}
              />
            </View>
          </>
        ) : sections[sectionIndex].title === 'Skills' || sections[sectionIndex].title === 'Languages' || sections[sectionIndex].title === 'Interests' ? (
          <View style={styles.inputRow}>
           <Image source={icons[sections[sectionIndex].title.toLowerCase()] || icons.default} style={styles.inputIcon} />

            <TextInput
              placeholder={sections[sectionIndex].title}
              value={item}
              onChangeText={(value) => handleChange(sectionIndex, index, null, value)}
              placeholderTextColor={COLORS.darkgray}
              style={styles.inputSkill}
            />
          </View>
        ) : sections[sectionIndex].title === 'Education' ? (
          <>
            {[
              { key: 'institution', placeholder: 'Institution', icon: icons.school },
              { key: 'degree', placeholder: 'Degree', icon: icons.degree },
              { key: 'duration', placeholder: 'Duration', icon: icons.calendar },
            ].map(({ key, placeholder, icon }) => (
              <View key={key} style={styles.inputRow}>
                <Image source={icon} style={styles.inputIcon} />
                <TextInput
                  placeholder={placeholder}
                  value={item[key] || ''}
                  onChangeText={(value) => handleChange(sectionIndex, index, key, value)}
                  placeholderTextColor={COLORS.darkgray}
                  style={styles.input}
                />
              </View>
            ))}
          </>
        ) : sections[sectionIndex].title === 'Certifications' ? (
          <>
            {[
              { key: 'name', placeholder: 'Certification Name', icon: icons.certificate },
              { key: 'institute', placeholder: 'Institute', icon: icons.institute },
              { key: 'duration', placeholder: 'Duration', icon: icons.calendar },
            ].map(({ key, placeholder, icon }) => (
              <View key={key} style={styles.inputRow}>
                <Image source={icon} style={styles.inputIcon} />
                <TextInput
                  placeholder={placeholder}
                  value={item[key] || ''}
                  onChangeText={(value) => handleChange(sectionIndex, index, key, value)}
                  placeholderTextColor={COLORS.darkgray}
                  style={styles.input}
                />
              </View>
            ))}
          </>
        ) : sections[sectionIndex].title === 'Projects' ? (
          <>
            {[
              { key: 'projectName', placeholder: 'Project Name', icon: icons.project },
              { key: 'projectDescription', placeholder: 'Project Description', icon: icons.description },
            ].map(({ key, placeholder, icon }) => (
              <View key={key} style={styles.inputRow}>
                <Image source={icon} style={styles.inputIcon} />
                <TextInput
                  placeholder={placeholder}
                  value={item[key] || ''}
                  onChangeText={(value) => handleChange(sectionIndex, index, key, value)}
                  placeholderTextColor={COLORS.darkgray}
                  style={key === 'projectDescription' ? [styles.input, styles.descriptionInput] : styles.input}
                  multiline={key === 'projectDescription'}
                  numberOfLines={key === 'projectDescription' ? 3 : 1}
                />
              </View>
            ))}
          </>
        ) : (
          <>
            {[
              { key: 'jobTitle', placeholder: 'Job Title', icon: icons.job },
              { key: 'company', placeholder: 'Company Name', icon: icons.profile },
              { key: 'location', placeholder: 'Company Location (e.g., New York, US)', icon: icons.location },
              { key: 'date', placeholder: 'Dates (e.g., Jan 2020 - Present)', icon: icons.calendar },
              { key: 'description', placeholder: 'Description', icon: icons.description },
            ].map(({ key, placeholder, icon }) => (
              <View key={key} style={styles.inputRow}>
                <Image source={icon} style={styles.inputIcon} />
                <TextInput
                  placeholder={placeholder}
                  value={item[key] || ''}
                  onChangeText={(value) => handleChange(sectionIndex, index, key, value)}
                  placeholderTextColor={COLORS.darkgray}
                  style={key === 'description' ? [styles.input, styles.descriptionInput] : styles.input}
                  multiline={key === 'description'}
                  numberOfLines={key === 'description' ? 3 : 1}
                />
              </View>
            ))}
          </>
        )}
        <TouchableOpacity onPress={() => removeItem(sectionIndex, index)} style={styles.removeItemButton}>
          <Image style={[styles.icon, { tintColor: 'red' }]} source={icons.trash} />
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
      <View style={styles.first}>
        <Text style={styles.firstText}>Creating your proffesional profile and resume requires you filling out this info 📃</Text>
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
  first:{
   marginHorizontal:23,
    backgroundColor:'#f4f4f4', 
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: COLORS.primary,
  },
  firstText:{
   fontSize:16,
   },
  container: {
    flex: 1,
    padding:15,
    backgroundColor: '#f4f4f4', // Light background color
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth:1,
    borderBottomColor:COLORS.black
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: COLORS.black,
  },
  descriptionInput: {
    minHeight: 60,
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
    backgroundColor: COLORS.black,
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
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color:COLORS.black,
  },
  inputSkill: {
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
    backgroundColor:COLORS.green,
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
