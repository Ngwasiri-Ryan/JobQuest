import React, { useState, useEffect } from 'react';
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
import { updateProject } from '../../../../backend/profile/updates/updateProject';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

import { COLORS, FONTS, images, icons } from '../../../constants';

const EditProject = ({ route, navigation }) => {
  // Ensure that projects is defined before initializing the state
  const { projects } = route.params;
  const [editedProjects, setEditedProjects] = useState(projects || []);
  const { userData } = useUserContext();
  const username = userData.username;

  const [loading, setLoading] = useState(false);

  // Handle input changes for the project
  const handleInputChange = (index, field, value) => {
    const updatedProjects = [...editedProjects];
    updatedProjects[index][field] = value;
    setEditedProjects(updatedProjects);
  };

  // Save the changes to the backend
  const handleSave = async () => {
    setLoading(true);
    const response = await updateProject(username, editedProjects);
    setLoading(false);
    if (response.success) {
      console.log(response.message);
      navigation.goBack();
    } else {
      console.error(response.error);
    }
  };

  // Handle adding a new project
  const handleAddProject = () => {
    const newProject = {
      projectName: '',
      projectDescription: '',
      link: '',
    };
    setEditedProjects([...editedProjects, newProject]);
  };

  // Handle deleting a project
  const handleDeleteProject = (index) => {
    const updatedProjects = [...editedProjects];
    updatedProjects.splice(index, 1);
    setEditedProjects(updatedProjects);
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
      <Text style={styles.title}>Edit Projects</Text>
      </View>

      {editedProjects.map((project, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.inputRow}>
            <Image source={icons.project} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={project.projectName}
              onChangeText={(value) => handleInputChange(index, 'projectName', value)}
              placeholder="Project Name"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <View style={styles.inputRow}>
            <Image source={icons.description} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={project.projectDescription}
              onChangeText={(value) => handleInputChange(index, 'projectDescription', value)}
              placeholder="Project Description"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <TouchableOpacity onPress={() => handleDeleteProject(index)}>
            <Image source={icons.trash} style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
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

export default EditProject;
