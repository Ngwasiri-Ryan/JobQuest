import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import ProgressBar from '../../components/ProgressBar';
import { COLORS, FONTS, icons } from '../../constants';
import { savePersonalInfo } from '../../../backend/personal/personal'; // Import the function
import { useUserContext } from '../../hooks/UserContext';  // Import the custom hook

const Step1 = ({ navigation, setProgress }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [isNameFocused, setNameFocused] = useState(false);
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPhoneFocused, setPhoneFocused] = useState(false);

  // Get user data from the context
  const { userData } = useUserContext();
  
  // Extract username from userData
  const username = userData?.username; // Use optional chaining to avoid errors if userData is null

  const handleNext = async () => {
    if (!username) {
      console.error("Username is not available");
      return;
    }

    // Save personal info to Firestore with the username from context
    const result = await savePersonalInfo({ name, email, phone, username });
    
    if (result.success) {
      // Navigate to the next step if the data is saved successfully
      navigation.navigate('Step2');
    } else {
      // Handle error, e.g., show a message to the user
      console.error('Error saving personal info:', result.message);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Let's make your professional profile 🖋️</Text>
      </View>

      <Text style={{ color: COLORS.black }}>Step 1/3</Text>
      <ProgressBar progress={30} />

      <Text style={styles.title}>Tell Us About Yourself</Text>
      <Text style={styles.description}>Fill in your basic details to get started.</Text>

      <View style={[styles.inputContainer, isNameFocused && styles.inputContainerFocused]}>
        <Image style={styles.icon} source={icons.name} />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          placeholderTextColor={COLORS.darkgray}
          onChangeText={setName}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
        />
      </View>

      <View style={[styles.inputContainer, isEmailFocused && styles.inputContainerFocused]}>
        <Image style={styles.icon} source={icons.mail} />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          placeholderTextColor={COLORS.darkgray}
          value={email}
          onChangeText={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
        />
      </View>

      <View style={[styles.inputContainer, isPhoneFocused && styles.inputContainerFocused]}>
        <Image style={styles.icon} source={icons.phone} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          placeholderTextColor={COLORS.darkgray}
          value={phone}
          onChangeText={setPhone}
          onFocus={() => setPhoneFocused(true)}
          onBlur={() => setPhoneFocused(false)}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleNext} // Use the handleNext function
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.darkgray,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 50,
    width: 330,
    marginBottom: 20,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
  },
  icon: {
    height: 20,
    width: 20,
    tintColor: COLORS.primary,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: COLORS.black,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 19,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
  },
  bannerText: {
    color: COLORS.black,
    ...FONTS.h1,
    marginBottom: 50,
  },
});

export default Step1;
