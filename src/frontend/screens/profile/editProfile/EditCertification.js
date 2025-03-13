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
import { updateCertification } from '../../../../backend/profile/updates/updateCertification';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

import { COLORS, FONTS, icons } from '../../../constants';

const EditCertification = ({ route, navigation }) => {
  const { certifications } = route.params;
  const [editedCertifications, setEditedCertifications] = useState([...certifications]);
  const { userData } = useUserContext();
  const username = userData.username;

  const [loading, setLoading] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedCertifications = [...editedCertifications];
    updatedCertifications[index][field] = value;
    setEditedCertifications(updatedCertifications);
  };

  const handleSave = async () => {
    setLoading(true);
    const response = await updateCertification(username, editedCertifications);
    setLoading(false);
    if (response.success) {
      console.log(response.message);
      navigation.goBack();
    } else {
      console.error(response.error);
    }
  };

  const handleDeleteCertification = (index) => {
    const updatedCertifications = [...editedCertifications];
    updatedCertifications.splice(index, 1);
    setEditedCertifications(updatedCertifications);
  };

  const handleAddCertification = () => {
    const newCertification = {
      name: '',
      institute: '',
      duration: '',
    };
    setEditedCertifications([...editedCertifications, newCertification]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.back} style={styles.inputIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Certifications</Text>
      </View>

      {editedCertifications.map((cert, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.inputRow}>
            <Image source={icons.certificate} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={cert.name}
              onChangeText={(value) => handleInputChange(index, 'name', value)}
              placeholder="Certification Name"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <View style={styles.inputRow}>
            <Image source={icons.institute} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={cert.institute}
              onChangeText={(value) => handleInputChange(index, 'institute', value)}
              placeholder="Institute"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <View style={styles.inputRow}>
            <Image source={icons.calendar} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={cert.duration}
              onChangeText={(value) => handleInputChange(index, 'duration', value)}
              placeholder="Duration"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <TouchableOpacity onPress={() => handleDeleteCertification(index)}>
            <Image source={icons.trash} style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddCertification}>
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

export default EditCertification;
