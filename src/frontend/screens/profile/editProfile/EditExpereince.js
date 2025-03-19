import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useUserContext } from '../../../hooks/UserContext';
import { updateExperience } from '../../../../backend/profile/updates/updateExperience';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

import { COLORS, FONTS, images, icons } from '../../../constants';

const EditExperience = ({ route, navigation }) => {
  const { experiences } = route.params;
  const [editedExperiences, setEditedExperiences] = useState([...experiences]);
  const { userData } = useUserContext();
  const username = userData.username;

  const [loading, setLoading] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedExperiences = [...editedExperiences];
    updatedExperiences[index][field] = value;
    setEditedExperiences(updatedExperiences);
  };

  const handleSave = async () => {
    setLoading(true);
    const response = await updateExperience(username, editedExperiences);
    setLoading(false);
    if (response.success) {
      console.log(response.message);
      navigation.goBack();
    } else {
      console.error(response.error);
    }
  };

  const handleDeleteExperience = (index) => {
    const updatedExperiences = [...editedExperiences];
    updatedExperiences.splice(index, 1);
    setEditedExperiences(updatedExperiences);
  };

  const handleAddExperience = () => {
    const newExperience = {
      jobTitle: '',
      company: '',
      location: '',
      date: '',
      description: '',
    };
    setEditedExperiences([...editedExperiences, newExperience]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* Back Icon */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.back} style={styles.inputIcon} />
        </TouchableOpacity>
      </View>

      <View> 
        <Text style={styles.title}>Edit Experience</Text>
      </View>

      {editedExperiences.map((experience, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.inputRow}>
            <Image source={icons.job} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={experience.jobTitle}
              onChangeText={(value) => handleInputChange(index, 'jobTitle', value)}
              placeholder="Job Title"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <View style={styles.inputRow}>
            <Image source={icons.industry} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={experience.company}
              onChangeText={(value) => handleInputChange(index, 'company', value)}
              placeholder="Company"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <View style={styles.inputRow}>
            <Image source={icons.location} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={experience.location}
              onChangeText={(value) => handleInputChange(index, 'location', value)}
              placeholder="Location"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <View style={styles.inputRow}>
            <Image source={icons.calendar} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={experience.date}
              onChangeText={(value) => handleInputChange(index, 'date', value)}
              placeholder="Date (Duration of work)"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <View style={styles.inputRow}>
            <Image source={icons.description} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={experience.description}
              onChangeText={(value) => handleInputChange(index, 'description', value)}
              placeholder="Description"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <TouchableOpacity onPress={() => handleDeleteExperience(index)}>
            <Image source={icons.trash} style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddExperience}>
        <Image source={icons.add} style={styles.addIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: COLORS.white,
    flex: 1,
  },
  card: {
    backgroundColor: '#F2F8FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 5,
    padding: 10,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: height * 0.02,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.05,
    paddingTop:20,
    paddingBottom:20,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.red,
    marginTop: height * 0.02,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: height * 0.02,
    marginBottom: height * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    ...FONTS.body2,
    color: COLORS.white,
  },
  addButton: {
    backgroundColor: COLORS.green,
    height: height * 0.04,
    width: height * 0.04,
    marginBottom: 15,
    borderRadius: height * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: 15,
    height: 15,
    tintColor: COLORS.white,
  },
});

export default EditExperience;
