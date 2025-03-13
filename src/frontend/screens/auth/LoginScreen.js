import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { COLORS, icons } from '../../constants'; 
import { loginUser } from '../../../backend/auth/login';
import { useUserContext } from '../../hooks/UserContext';


const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUserData } = useUserContext();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await loginUser(email, password);
      setLoading(false);

      if (result.success) {
        const { user, username, isInPersonal } = result;
        setUserData({ email: user.email, username });
        console.log(`Username set in context: ${username}`);

        // Navigate based on the collection check
        if (isInPersonal) {
          navigation.navigate("JobSelectionScreen");
        } else {
          navigation.navigate("Step1");
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
      console.error(error);
    }
  };

  // const handleLogin =() =>{
  //   navigation.navigate("JobSelectionScreen");
  // }

  return (
    <View style={styles.container}>
      <Image source={icons.logo} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Please login to continue</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Image source={icons.mail} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={COLORS.darkgray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Image source={icons.lock} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.darkgray}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={hidePassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
          <Image
            source={hidePassword ? icons.eyeOff : icons.eye}
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={styles.loginButtonText}>Log In</Text>
        )}
      </TouchableOpacity>

      {/* Error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Register Redirect */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={styles.registerLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: height * 0.25,
    width: width * 0.7,
    marginBottom: height * 0.05,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.black,
    borderRadius: width * 0.025,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.015,
    marginBottom: height * 0.02,
    backgroundColor: COLORS.lightGrayBackground,
    borderBottomWidth: 2,
  },
  icon: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: COLORS.black,
    marginRight: width * 0.02,
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    color: COLORS.black,
  },
  eyeIcon: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: COLORS.gray,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: height * 0.02,
    borderRadius: width * 0.03,
    alignItems: 'center',
    marginTop: height * 0.03,
    width: width * 0.8,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  forgotPassword: {
    color: COLORS.primary,
    textAlign: 'center',
    fontSize: width * 0.04,
    marginBottom: height * 0.03,
    marginTop: height * 0.03,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: COLORS.black,
    fontSize: width * 0.04,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
