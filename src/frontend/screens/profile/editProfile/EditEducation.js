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
import { updateEducation } from '../../../../backend/profile/updates/updateEducation';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

import { COLORS, FONTS, icons } from '../../../constants';

const EditEducation = ({ route, navigation }) => {
  const { education } = route.params;
  const [editedEducation, setEditedEducation] = useState([...education]);
  const { userData } = useUserContext();
  const username = userData.username;

  const [loading, setLoading] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedEducation = [...editedEducation];
    updatedEducation[index][field] = value;
    setEditedEducation(updatedEducation);
  };

  const handleSave = async () => {
    setLoading(true);
    const response = await updateEducation(username, editedEducation);
    setLoading(false);
    if (response.success) {
      console.log(response.message);
      navigation.goBack();
    } else {
      console.error(response.error);
    }
  };

  const handleDeleteEducation = (index) => {
    const updatedEducation = [...editedEducation];
    updatedEducation.splice(index, 1);
    setEditedEducation(updatedEducation);
  };

  const handleAddEducation = () => {
    const newEducation = {
      degree: '',
      institution: '',
      duration: '',
    };
    setEditedEducation([...editedEducation, newEducation]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.back} style={styles.inputIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Education</Text>
      </View>

      {editedEducation.map((edu, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.inputRow}>
            <Image source={icons.education} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={edu.degree}
              onChangeText={(value) => handleInputChange(index, 'degree', value)}
              placeholder="Degree"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <View style={styles.inputRow}>
            <Image source={icons.institute} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={edu.institution}
              onChangeText={(value) => handleInputChange(index, 'institution', value)}
              placeholder="Institution"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <View style={styles.inputRow}>
            <Image source={icons.calendar} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={edu.duration}
              onChangeText={(value) => handleInputChange(index, 'duration', value)}
              placeholder="Duration"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <TouchableOpacity onPress={() => handleDeleteEducation(index)}>
            <Image source={icons.trash} style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddEducation}>
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
    borderRadius: 20,
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

export default EditEducation;
