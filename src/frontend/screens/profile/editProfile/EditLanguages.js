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
import { updateLanguages } from '../../../../backend/profile/updates/updateLanguages';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

import { COLORS, FONTS, icons } from '../../../constants';

const EditLanguages = ({ route, navigation }) => {
  const { languages } = route.params;
  const [editedLanguages, setEditedLanguages] = useState([...languages]);
  const { userData } = useUserContext();
  const username = userData.username;

  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (index, value) => {
    const updatedLanguages = [...editedLanguages];
    updatedLanguages[index] = value;
    setEditedLanguages(updatedLanguages);
  };

  const handleSave = async () => {
    setLoading(true);
    const response = await updateLanguages(username, editedLanguages);
    setLoading(false);
    if (response.success) {
      console.log(response.message);
      navigation.goBack();
    } else {
      console.error(response.error);
    }
  };

  const handleDeleteLanguage = (index) => {
    const updatedLanguages = [...editedLanguages];
    updatedLanguages.splice(index, 1);
    setEditedLanguages(updatedLanguages);
  };

  const handleAddLanguage = () => {
    setEditedLanguages([...editedLanguages, '']);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.back} style={styles.inputIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Languages</Text>
      </View>

      {editedLanguages.map((language, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.inputRow}>
            <Image source={icons.language} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={language}
              onChangeText={(value) => handleLanguageChange(index, value)}
              placeholder="Language"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <TouchableOpacity onPress={() => handleDeleteLanguage(index)}>
            <Image source={icons.trash} style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddLanguage}>
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
    width: 25,
    height: 25,
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

export default EditLanguages;
