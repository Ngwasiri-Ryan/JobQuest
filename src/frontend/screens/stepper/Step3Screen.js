import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { COLORS, images } from '../../constants';
import ProgressBar from '../../components/ProgressBar';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const Step3 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.stepText}>Step 3/3</Text>
      <ProgressBar progress={100} />

      <Text style={styles.header}>Create Your Resume 📃</Text>

      <View style={styles.buttonContainer}>
        <View style={styles.imageHolder}>
          <Image source={images.resume} style={styles.image} />
        </View>
      </View>

      <Text style={styles.descriptionText}>
        You'll have to create your resume to continue with us for your profile.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('OnboardingScreen')}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

     <TouchableOpacity onPress={() => navigation.navigate('JobSelectionScreen')}>
        <Text style={styles.bottomText}>I'll do it later</Text>
     </TouchableOpacity>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05, // 5% of screen width
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontSize: width * 0.04, // 4% of screen width
    color: COLORS.darkgray,
    marginBottom: height * 0.02, // 2% of screen height
  },
  header: {
    fontSize: width * 0.07, // 7% of screen width
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: height * 0.02, // 2% of screen height
    marginTop: height * 0.05, // 5% of screen height
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: width * 0.05, // 5% of screen width
    marginBottom: height * 0.03, // 3% of screen height
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageHolder: {
    alignItems: 'center',
  },
  image: {
    width: width * 0.8, // 80% of screen width
    height: height * 0.4, // 40% of screen height
    marginTop: height * 0.02, // 2% of screen height
  },
  descriptionText: {
    fontSize: width * 0.04, // 4% of screen width
    color: COLORS.darkgray,
    textAlign: 'center',
    marginHorizontal: width * 0.05, // 5% of screen width
    lineHeight: height * 0.03, // 3% of screen height
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: height * 0.02, // 2% of screen height
    borderRadius: 8,
    alignItems: 'center',
    width: width * 0.7, // 70% of screen width
    marginTop: height * 0.04, // 4% of screen height
  },
  buttonText: {
    color: COLORS.white,
    fontSize: width * 0.05, // 5% of screen width
    fontWeight: 'bold',
  },
  bottomText: {
    fontSize: width * 0.04, // 4% of screen width
    color: COLORS.primary,
    marginTop: height * 0.02, // 2% of screen height
    textAlign: 'center',
    marginHorizontal: width * 0.05, // 5% of screen width
    lineHeight: height * 0.03, // 3% of screen height
    fontWeight:'bold'
  },
});

export default Step3;