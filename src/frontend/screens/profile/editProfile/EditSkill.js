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
import { updateSkills } from '../../../../backend/profile/updates/updateSkills';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

import { COLORS, FONTS, icons } from '../../../constants';

const EditSkill = ({ route, navigation }) => {
  const { skills } = route.params;
  const [editedSkills, setEditedSkills] = useState([...skills]);
  const { userData } = useUserContext();
  const username = userData.username;

  const [loading, setLoading] = useState(false);

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...editedSkills];
    updatedSkills[index] = value;
    setEditedSkills(updatedSkills);
  };

  const handleSave = async () => {
    setLoading(true);
    const response = await updateSkills(username, editedSkills);
    setLoading(false);
    if (response.success) {
      console.log(response.message);
      navigation.goBack();
    } else {
      console.error(response.error);
    }
  };

  const handleDeleteSkill = (index) => {
    const updatedSkills = [...editedSkills];
    updatedSkills.splice(index, 1);
    setEditedSkills(updatedSkills);
  };

  const handleAddSkill = () => {
    setEditedSkills([...editedSkills, '']);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.back} style={styles.inputIcon} />
        </TouchableOpacity>
      
      </View>

      <View>
      <Text style={styles.title}>Edit Skills</Text>
      </View>

      {editedSkills.map((skill, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.inputRow}>
            <Image source={icons.skill} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={skill}
              onChangeText={(value) => handleSkillChange(index, value)}
              placeholder="Skill"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <TouchableOpacity onPress={() => handleDeleteSkill(index)}>
            <Image source={icons.trash} style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddSkill}>
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

export default EditSkill;
