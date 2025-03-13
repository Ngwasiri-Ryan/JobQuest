import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, LogBox, ScrollView, Dimensions,TouchableOpacity } from 'react-native';
import { COLORS, icons, FONTS } from '../../constants';
import { useUserContext } from '../../hooks/UserContext';
import { fetchUserActivity } from '../../../backend/profile/activity';
import DotLoader from '../../components/loading/DotLoader';
import AppliedJobs from '../../components/home/AppliedJobs';
import GenerateResumeButton from '../../components/resume/ResumeButton';

const { width, height } = Dimensions.get('window');

// Ignore specific warnings if needed
LogBox.ignoreLogs(['Warning: ...']); // Replace with specific warning messages

const ActivityTab = ({ navigation }) => {
  const { userData } = useUserContext();
  const username = userData?.username;

  const [activityStatus, setActivityStatus] = useState(null);

  useEffect(() => {
    const checkUserActivity = async () => {
      if (username) {
        try {
          const exists = await fetchUserActivity(username);
          if (exists) {
            setActivityStatus('Profile created, resume built');
          } else {
            setActivityStatus('Resume and Profile not created');
          }
        } catch (error) {
          console.error("Error fetching user activity: ", error);
          setActivityStatus('Error checking activity');
        }
      } else {
        setActivityStatus('No username found');
      }
    };

    checkUserActivity();
  }, [username]);

  const handleProfileCreation = () => {
    console.log('Navigating to Profile Creation');
  };

  const handleResumeCreation = () => {
    console.log('Navigating to Resume Creation');
  };

  if (activityStatus === null) {
    return <DotLoader />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recent Activity</Text>
      {activityStatus === 'Profile created, resume built' ? (
        <View style={styles.successContainer}>
          <View style={styles.box}>
            <View style={styles.row}>
              <Image source={icons.profile_built} style={[styles.profileIcon, styles.icon]} />
              <Text style={styles.successText}>Profile Created</Text>
            </View>
            <Image source={icons.check} style={styles.icon} />
          </View>
          <View style={styles.box}>
            <View style={styles.row}>
              <Image source={icons.cv_built} style={[styles.resumeIcon, styles.icon]} />
              <Text style={styles.successText}>Resume Built</Text>
              <GenerateResumeButton username={username} />
            </View>
            <Image source={icons.check} style={styles.icon} />
          </View>
        </View>
      ) : (
        
          
          <View style={styles.successContainer}>
          
          <View style={styles.box}>
            <View style={styles.row}>
              <Image source={icons.profile_built} style={[styles.profileIcon, styles.icon]} />
              <Text style={styles.successText}>Profile Created</Text>
            </View>
            <Image source={icons.cross} style={styles.icon} />
          </View>
          <View style={styles.box}>
            <View style={styles.row}>
              <Image source={icons.cv_built} style={[styles.resumeIcon, styles.icon]} />
              <Text style={styles.successText}>Resume Built</Text>
            </View>
            <Image source={icons.cross} style={styles.icon} />
          </View>
          <TouchableOpacity
                 style={styles.createResumeButton}
                 onPress={() => navigation.navigate('Step3')}
               >
                 <Text style={styles.createResumeButtonText}>Create Resume</Text>
               </TouchableOpacity>
        </View>
        
      )}
      <Text style={styles.heading}>Applied Jobs</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <AppliedJobs />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', 
    marginBottom:height*0.08
  },
  horizontalScroll: {
    paddingVertical: height * 0.02,
    backgroundColor: '#f9f9f9', 
  },
  heading: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: height * 0.01,
  },
  box: {
    backgroundColor: COLORS.white,
    width: '100%',
    height: height * 0.08,
    borderRadius: 10,
    marginBottom: height * 0.02,
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successText: {
    fontSize: width * 0.04,
    color: COLORS.black,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: COLORS.lightRed,
    padding: width * 0.05,
    borderRadius: 10,
    alignItems: 'center',
  },
  createResumeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: height * 0.02, // 2% of screen height
    paddingHorizontal: width * 0.1, // 10% of screen width
    borderRadius: 8,
    marginBottom: height * 0.03,
    justifyContent:'center',
    alignItems:'center'
  },
  createResumeButtonText: {
    color: COLORS.white,
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: width * 0.045,
    color: COLORS.red,
    marginBottom: height * 0.02,
  },
  icon: {
    height: width * 0.06,
    width: width * 0.06,
  },
  resumeIcon: {
    tintColor: '#B65FCF',
  },
  profileIcon: {
    tintColor: '#018154',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
});

export default ActivityTab;
