import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { COLORS, icons } from "../../constants";
import { updateUserProfile } from "../../../backend/user/editProfile";
import { useUserContext } from "../../hooks/UserContext";

const { width, height } = Dimensions.get("window");

const scaleWidth = (size) => (width / 375) * size; // Scale width based on a base width of 375
const scaleHeight = (size) => (height / 812) * size; // Scale height based on a base height of 812

const EditProfileScreen = ({ route, navigation }) => {
  const { username, email, password } = route.params;
  const { userData, setUserData } = useUserContext();

  const [name, setName] = useState(username);
  const [userEmail, setUserEmail] = useState(email);
  const [passwordString, setPasswordString] = useState(password);

  const handleSave = async () => {
    const updates = {
      username: name,
      email: userEmail,
      password: passwordString,
    };

    const result = await updateUserProfile(username, updates);

    if (result.success) {
      setUserData((prevData) => ({
        ...prevData,
        username: name,
        email: userEmail,
      }));

      Alert.alert("Success", result.message, [
        { text: "OK", onPress: () => navigation.navigate("LoginScreen") },
      ]);
    } else {
      Alert.alert("Error", result.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={icons.logo} style={styles.logo} />
      </View>

      <Text style={styles.header}>Edit Profile</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={userEmail}
          onChangeText={setUserEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={passwordString}
          onChangeText={setPasswordString}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleHeight(40),
    backgroundColor: "#F9FAFB",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: scaleHeight(20),
  },
  logo: {
    height: scaleHeight(200),
    width: scaleWidth(350),
    resizeMode: "contain",
  },
  header: {
    fontSize: scaleWidth(26),
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: scaleHeight(30),
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: scaleHeight(20),
  },
  label: {
    fontSize: scaleWidth(14),
    color: COLORS.black,
    marginBottom: scaleHeight(5),
    fontWeight: "500",
  },
  input: {
    height: scaleHeight(50),
    borderWidth: 1,
    borderRadius: scaleWidth(12),
    paddingHorizontal: scaleWidth(15),
    backgroundColor: "#FFF",
    fontSize: scaleWidth(16),
    color: COLORS.black,
    borderColor: COLORS.lightGray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: scaleHeight(2) },
    shadowOpacity: 0.1,
    shadowRadius: scaleWidth(4),
    elevation: 2,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    height: scaleHeight(50),
    borderRadius: scaleWidth(12),
    justifyContent: "center",
    alignItems: "center",
    marginTop: scaleHeight(20),
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: scaleHeight(4) },
    shadowOpacity: 0.3,
    shadowRadius: scaleWidth(5),
    elevation: 3,
  },
  saveButtonText: {
    fontSize: scaleWidth(18),
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
