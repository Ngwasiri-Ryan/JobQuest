import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { COLORS, images, icons } from '../../constants';
import OverviewTab from './OverviewTab';
import SavedJobsTab from './SavedJobsTab';
import ActivityTab from './Activityab';
import Loader from '../../components/loading/Loader';
import { fetchuserDetails } from '../../../backend/profile/overview';
import { useUserContext } from '../../hooks/UserContext';
import { profileCheck } from '../../../backend/profile/profileCheck';

const { width, height } = Dimensions.get('window');

const UserProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [userDetails, setUserDetails] = useState(null);
  const [isProfileSetup, setIsProfileSetup] = useState(false); // State to track if profile is set up
  const { userData } = useUserContext();
  const username = userData.username;

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(false);

        // Check if the user exists in the 'personal' collection
        const profileCheckResult = await profileCheck(username);
        if (!profileCheckResult.success) {
          throw new Error('Failed to check profile status.');
        }

        // If the user does not exist in the 'personal' collection, set isProfileSetup to false
        if (!profileCheckResult.isInPersonal) {
          setIsProfileSetup(false);
          setLoading(false);
          return;
        }

        // If the user exists, fetch their details
        const data = await fetchuserDetails(username);
        setUserDetails(data);
        setIsProfileSetup(true); // Set isProfileSetup to true
      } catch (error) {
        setError(true);
        console.error('Error loading user data: ', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load user data. Please try again.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => setLoading(true)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If the profile is not set up, show the "Set Up Professional Profile" view
  if (!isProfileSetup) {
    return (
      <View style={styles.setupProfileContainer}>
         <View style={styles.imgBox}>
         <Image source={images.no_profile_data} style={styles.no_profile_image} />
         </View>
        <TouchableOpacity
          style={styles.setupProfileButton}
          onPress={() => navigation.navigate('Step1')} // Navigate to the setup screen
        >
          <Text style={styles.setupProfileButtonText}>Set Up Professional Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewTab />;
      case 'Activity':
        return <ActivityTab />;
      case 'Saved Jobs':
        return <SavedJobsTab />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={icons.back} style={styles.iconBack} />
      </TouchableOpacity>

       {/* Back Button */}
       <TouchableOpacity style={styles.videoButton} onPress={() => navigation.navigate('VideoListScreen')}>
        <Image source={icons.video} style={styles.iconBack} />
      </TouchableOpacity>
      
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profilePictureContainer}>
          <Image source={images.pic} style={styles.profilePicture} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.name}>
            {userDetails.personal.name}{' '}
            {userDetails.verified && <Text style={styles.verifiedBadge}>✓</Text>}
          </Text>
          <Text style={styles.username}>{userDetails.current.jobTitle}</Text>
          {/* <Text style={styles.bio}>{userDetails.personalDetails.summary || 'N/A'}</Text> */}
        </View>
        {/* Interview Button */}
        <TouchableOpacity
          style={styles.interviewButton}
          onPress={() => navigation.navigate('InterviewPrepScreen')}
        >
          <Text style={styles.interviewButtonText}>Prepare for Interview</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {['Overview', 'Activity', 'Saved Jobs'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView contentContainerStyle={styles.profileDetails}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  imgBox:{
   width:'100%',
   height:'60%',
   display:'flex',
   alignItems:'center',
   justifyContent:'center'
  },
  no_profile_image:{
    height:450,
    width:400,
    objectFit:'cover'

  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: height * 0.03,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10, // Ensure it stays on top of other components
  },
  videoButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10, // Ensure it stays on top of other components
  },
  iconBack: {
    width: 25,
    height: 25,
    tintColor: COLORS.white,
  },
  profilePictureContainer: {
    borderRadius: height * 0.1,
    borderWidth: 3,
    borderColor: COLORS.white,
    overflow: 'hidden',
  },
  profilePicture: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  name: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  username: {
    fontSize: width * 0.04,
    color: COLORS.lightGray,
    marginBottom: height * 0.01,
  },
  bio: {
    fontSize: width * 0.035,
    color: COLORS.lightGray,
    textAlign: 'center',
  },
  interviewButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  interviewButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.black,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingVertical: height * 0.015,
    backgroundColor: COLORS.white,
  },
  tabItem: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  tabText: {
    fontSize: width * 0.04,
    color: COLORS.darkGray,
  },
  profileDetails: {
    padding: width * 0.05,
    backgroundColor:COLORS.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  errorText: {
    fontSize: width * 0.045,
    color: COLORS.red,
    marginBottom: height * 0.02,
  },
  retryButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  setupProfileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  setupProfileButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  setupProfileButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default UserProfileScreen;