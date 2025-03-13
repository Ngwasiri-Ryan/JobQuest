import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { COLORS, icons } from '../../constants';
import { signUpUser } from '../../../backend/auth/signup';

const { width, height } = Dimensions.get('window');

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSignUp = async () => {
    if (username && email && password) {
      setLoading(true);
      const result = await signUpUser(username, email, password);
      setLoading(false);
      if (result.success) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => navigation.navigate('LoginScreen') },
        ]);
      } else {
        Alert.alert("Error", result.error || "Something went wrong!");
      }
    } else {
      Alert.alert("Error", "Please fill in all fields.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={icons.logo} style={styles.logo} />
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <View style={styles.inputContainer}>
        <Image source={icons.user} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={COLORS.darkgray}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Image source={icons.mail} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={COLORS.darkgray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Image source={icons.lock} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.darkgray}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
          <Image
            source={isPasswordVisible ? icons.eye : icons.eyeOff}
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.alreadyMemberText}>
        Already have an account?{' '}
        <Text style={styles.loginText} onPress={() => navigation.navigate('LoginScreen')}>
          Log in
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: height * 0.25,
    width: width * 0.6,
    resizeMode: 'contain',
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.black,
    borderRadius: 10,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    marginBottom: height * 0.02,
    backgroundColor: COLORS.white,
    width: '100%',
    borderBottomColor:COLORS.black,
    borderBottomWidth:2,
  },
  icon: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: COLORS.black,
    marginRight: width * 0.03,
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    color: COLORS.black,
  },
  eyeIconContainer: {
    padding: width * 0.02,
  },
  eyeIcon: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: COLORS.gray,
  },
  signUpButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: height * 0.02,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: height * 0.02,
    width: '100%',
  },
  signUpButtonText: {
    color: COLORS.white,
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  alreadyMemberText: {
    textAlign: 'center',
    color: COLORS.darkgray,
    fontSize: width * 0.04,
    marginTop: height * 0.02,
  },
  loginText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
