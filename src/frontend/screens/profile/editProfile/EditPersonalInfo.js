import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, icons } from '../../../constants'; // Assuming you have icons in constants
import { useUserContext } from '../../../hooks/UserContext';
import { updatePersonalInfo } from '../../../../backend/profile/updates/updatePersonalInfo';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const EditPersonalInfo = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { personalDetails } = route.params;
  const { userData } = useUserContext();
  const username = userData.username;

  const [formData, setFormData] = useState({
    name: personalDetails.name,
    email: personalDetails.email,
    phone: personalDetails.phone,
    city: personalDetails.city,
    town: personalDetails.town,
    country: personalDetails.country,
    summary: personalDetails.summary,
  });

  const [loading, setLoading] = useState(false); // State to track loading status

  // Handle saving the changes
  const handleSave = async () => {
    setLoading(true); // Start loading
    const response = await updatePersonalInfo(username, formData);
    setLoading(false); // Stop loading

    if (response.success) {
      console.log('Success:', response.message);
      navigation.goBack();
    } else {
      console.log('Error:', response.error); // Show error if updating fails
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={icons.back} style={styles.inputIcon} />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Personal Info</Text>

      {/* Name */}
      <View style={styles.inputContainer}>
        <Image source={icons.name} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Full Name"
        />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Image source={icons.mail} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Email"
        />
      </View>

      {/* Phone */}
      <View style={styles.inputContainer}>
        <Image source={icons.phone} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Phone"
        />
      </View>

      {/* City */}
      <View style={styles.inputContainer}>
        <Image source={icons.town} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
          placeholder="City"
        />
      </View>

      {/* Town */}
      <View style={styles.inputContainer}>
        <Image source={icons.location} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={formData.town}
          onChangeText={(text) => setFormData({ ...formData, town: text })}
          placeholder="Town"
        />
      </View>

      {/* Country */}
      <View style={styles.inputContainer}>
        <Image source={icons.globe} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={formData.country}
          onChangeText={(text) => setFormData({ ...formData, country: text })}
          placeholder="Country"
        />
      </View>

      {/* Summary */}
      <View style={styles.inputContainer}>
        <Image source={icons.job} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={formData.summary}
          onChangeText={(text) => setFormData({ ...formData, summary: text })}
          placeholder="Summary"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        style={[styles.saveButton, loading && styles.disabledButton]} // Add disabled style if loading
        disabled={loading} // Disable button when loading
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width * 0.05, // 5% of the screen width
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    flex: 1,
    paddingTop: height * 0.05, // Adjust padding top to ensure content is not blocked by status bar
  },
  title: {
    fontSize: width * 0.06, // 6% of the screen width
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: height * 0.02, // 2% of the screen height
  },
  inputContainer: {
    flexDirection: 'row', // Align icon and input horizontally
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
    marginBottom: height * 0.02, // 2% of the screen height
  },
  inputIcon: {
    width: 20, // Icon width
    height: 20, // Icon height
    marginRight: 10, // Space between icon and input field
  },
  input: {
    flex: 1, // Make input field take remaining space
    padding: width * 0.04, // 4% of the screen width
    fontSize: width * 0.039,
    color: COLORS.black,
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05, // Place at the top of the screen with margin from the top
    left: width * 0.05, // Margin from the left side of the screen
    zIndex: 1, // Make sure it's on top of other elements
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: width * 0.04, // 4% of the screen width
    borderRadius: 10,
    alignItems: 'center',
    marginTop: height * 0.05, // 5% of the screen height
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: width * 0.05, // 5% of the screen width
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7, // Dim the button when disabled
  },
});

export default EditPersonalInfo;
