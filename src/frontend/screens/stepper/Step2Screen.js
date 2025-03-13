import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, icons } from '../../constants';
import ProgressBar from '../../components/ProgressBar';
import { useUserContext } from '../../hooks/UserContext';  
import { saveCurrentUserInfo } from '../../../backend/current/current'; 

const Step2 = ({ navigation }) => {
  const { userData } = useUserContext(); // Get username from context
  const username = userData.username;
  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [skills, setSkills] = useState([]);

  const handleSaveData = async () => {
    
    if (!jobTitle || !industry || !experienceLevel || skills.length === 0) {
      alert('Please fill out all fields!');
      return;
    }

    // Create the current user data object
    const currentUserData = {
      username,
      jobTitle,
      industry,
      experienceLevel,
      skills,
    };

    // Save data to Firestore
    const result = await saveCurrentUserInfo(currentUserData);

    if (result.success) {
      // If successful, navigate to the next step
      navigation.navigate('Step3');
    } else {
      // Handle failure to save data
      alert(`Error: ${result.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: COLORS.black }}>Step 2/3</Text>
      <ProgressBar progress={50} />
      <Text style={styles.header}>Career Details</Text>
      <Text style={styles.subHeader}>Tell us about your professional background.</Text>

      {/* Job Title */}
      <View style={styles.inputContainer}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
          <Image source={icons.job} style={styles.icon} />
          <Text style={styles.label}>Current Job Title</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="e.g., Software Engineer"
          placeholderTextColor={COLORS.darkgray}
          value={jobTitle}
          onChangeText={setJobTitle}
        />
      </View>

      {/* Industry */}
      <View style={styles.inputContainer}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
          <Image source={icons.industry} style={styles.icon} />
          <Text style={styles.label}>Industry</Text>
        </View>
        <Picker
          selectedValue={industry}
          style={styles.picker}
          onValueChange={(itemValue) => setIndustry(itemValue)}
        >
          <Picker.Item label="Select Industry" value="" />
          <Picker.Item label="IT" value="IT" />
          <Picker.Item label="Healthcare" value="Healthcare" />
          <Picker.Item label="Finance" value="Finance" />
        </Picker>
      </View>

      {/* Experience Level */}
      <View style={styles.inputContainer}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
          <Image source={icons.levels} style={styles.icon} />
          <Text style={styles.label}>Experience Level</Text>
        </View>
        <Picker
          selectedValue={experienceLevel}
          style={styles.picker}
          onValueChange={(itemValue) => setExperienceLevel(itemValue)}
        >
          <Picker.Item label="Entry" value="Entry" />
          <Picker.Item label="Mid" value="Mid" />
          <Picker.Item label="Senior" value="Senior" />
        </Picker>
      </View>

      {/* Skills */}
      <View style={styles.inputContainer}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
          <Image source={icons.skills} style={styles.icon} />
          <Text style={styles.label}>Skills</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Add skills (e.g., React, SQL)"
          placeholderTextColor={COLORS.darkgray}
          value={skills.join(', ')}
          onChangeText={(text) => setSkills(text.split(', '))}
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.button} onPress={handleSaveData}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    padding: 20,
    backgroundColor: COLORS.white,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: COLORS.darkgray,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 10,
    width: '100%', // Ensure inputs stretch to full width
  },
  label: {
    fontSize: 14,
    color: COLORS.darkgray,
    marginBottom: 5,
  },
  input: {
    height: 40,
    fontSize: 16,
    color: COLORS.black,
  },
  picker: {
    height: 40,
    color: COLORS.black,
  },
  icon: {
    height: 20,
    width: 20,
    tintColor: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '100%', // Ensure button stretches to full width
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: 'bold',
  },
});

export default Step2;
