import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { COLORS, FONTS, icons } from '../../constants';
import { useUserContext } from '../../hooks/UserContext';
import { saveAppliedJob } from '../../../backend/history/appliedJobs';

const { width, height } = Dimensions.get('window');

const JobDetailsScreen = ({ route }) => {
  const { job } = route.params;
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [employerLogo, setEmployerLogo] = useState(job.employer_logo);
  const { userData } = useUserContext();
  const username = userData.username;
  
  const jobHighlights = job.job_highlights || {};
  const benefits = jobHighlights.Benefits || [];
  const qualifications = jobHighlights.Qualifications || [];
  const responsibilities = jobHighlights.Responsibilities || [];

  // Fetch employer logo if not provided
  const fetchEmployerLogo = async () => {
    if (!job.employer_logo && job.employer_name) {
      try {
        const response = await axios.get(
          `https://logo.clearbit.com/${job.employer_name
            .split(' ')
            .join('')
            .toLowerCase()}.com`
        );
        setEmployerLogo(response.config.url);
      } catch (error) {
        console.error('Error fetching employer logo:', error);
      }
    }
  };

  useEffect(() => {
    fetchEmployerLogo();
  }, []);

  // Function to infer domain from publisher name dynamically
const getDomainFromPublisher = (publisher) => {
  const sanitizedPublisher = publisher
    .replace(".com", "") // Remove ".com" if it exists
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "") // Remove spaces
    .trim(); // Trim any extra whitespace

  // Assume the domain is derived as "<sanitizedPublisher>.com"
  return `${sanitizedPublisher}.com`;
};

const handleApplyJob = async () => {
  try {
    // Save the applied job using the saveAppliedJob function
    await saveAppliedJob(job, username);
    // Open the modal after successfully saving the job
   // setModalVisible(true);
  navigation.navigate('QuestBrowserScreen', {url: job.job_apply_link || job.option.apply_link })
  } catch (error) {
    console.error('Error applying for the job:', error.message);
  }
};

  return (
    <View style={styles.container}>
      {/* Fixed backdrop */}
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={icons.back} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <View style={styles.imageWrapper}>
            {employerLogo ? (
              <Image source={{ uri: employerLogo }} style={styles.logo} />
            ) : (
              <Image source={icons.suitcase} style={styles.logo} />
            )}
          </View>
        </View>

        {/* Job title and employer name */}
        <Text style={styles.title}>{job.job_title}</Text>
        <Text style={styles.employerName}>{job.employer_name}</Text>

        <View style={styles.box}>
          <View style={styles.holder}>
            <Text style={styles.boldText}>
              {job.job_employment_type === 'FULLTIME'
                ? 'Full-Time'
                : 'Part-Time'}
            </Text>
          </View>
          <View style={styles.holderMiddle}>
            <Text style={styles.boldText}>
              {job.job_city}, {job.job_state}
            </Text>
          </View>
          <View style={styles.holderLast}>
            <Text style={styles.details}>
              <Text style={styles.boldText}>
                {job.job_is_remote ? 'Remote' : 'Onsite'}
              </Text>
            </Text>
          </View>
        </View>

        {/* Degree, Experience, and Salary Requirements */}
        <View style={styles.requirementsContainer}>
          <View style={[styles.requirementsSection]}>
            <Image source={icons.experience} style={styles.icon} />
            <Text style={styles.requirementLabel}>Experience</Text>
            <Text style={styles.requirementValue}>
              {(() => {
                const experience = qualifications.find((q) =>
                  q.toLowerCase().includes('experience')
                );
                return experience ? 'Required' : 'Not specified';
              })()}
            </Text>
          </View>

          <View style={[styles.requirementsSection]}>
            <Image source={icons.degree} style={styles.icon} />
            <Text style={styles.requirementLabel}>Degree</Text>
            <Text style={styles.requirementValue}>
              {(() => {
                const degree = qualifications.find((q) =>
                  q.toLowerCase().includes('degree')
                );
                return degree ? 'Required' : 'Not specified';
              })()}
            </Text>
          </View>

          {/* Display salary estimate if available */}
          <View style={styles.requirementsSection}>
            <Image source={icons.salary} style={styles.icon} />
            <Text style={styles.requirementLabel}>Salary</Text>
            <Text style={styles.requirementValue}>
              {(() => {
                const salary = benefits.find((q) =>
                  q.toLowerCase().includes('salary')
                );
                return salary ? 'Mentoined' : 'Not specified';
              })()}
            </Text>
          </View>
        </View>
       
        {/* Publishers */}
        <View style={styles.publisherContainer}>
       
      {job.apply_options.map((option, index) => {
        const domain = getDomainFromPublisher(option.publisher);

        return (
          <TouchableOpacity key={index} style={styles.publisherItem}
          onPress={() => setModalVisible(true)} 
          >
            <Image
              source={{
                uri: `https://logo.clearbit.com/${domain}`,
              }}
              style={styles.publisher}
              resizeMode="contain"
            />
          </TouchableOpacity>
        );
      })}
    </View>



      </View>

      {/* Scrollable content */}
      <ScrollView style={styles.content}>
        <Text style={styles.heading}>Job Highlights</Text>
        <Text style={styles.subHeading}>Benefits</Text>
        {benefits.length > 0 ? (
          benefits.map((benefit, index) => (
            <Text key={`benefit-${index}`} style={styles.listItem}>
              • {benefit}
            </Text>
          ))
        ) : (
          <Text style={{color:COLORS.black}}>No benefits available</Text>
        )}

        <Text style={styles.subHeading}>Qualifications</Text>
        {qualifications.length > 0 ? (
          qualifications.map((qualification, index) => (
            <Text key={`qualification-${index}`} style={styles.listItem}>
              • {qualification}
            </Text>
          ))
        ) : (
          <Text>No qualifications available</Text>
        )}

        <Text style={styles.subHeading}>Responsibilities</Text>
        {responsibilities.length > 0 ? (
          responsibilities.map((responsibility, index) => (
            <Text key={`responsibility-${index}`} style={styles.listItem}>
              • {responsibility}
            </Text>
          ))
        ) : (
          <Text>No responsibilities available</Text>
        )}
        <Text style={styles.heading}>About Job</Text>
        <Text style={styles.description}>{job.job_description}</Text>
      </ScrollView>

      {/* Apply Button */}
      <TouchableOpacity
        style={styles.applyButton}
        onPress={handleApplyJob}
      >
        <Text style={styles.applyButtonText}>Apply Now</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backdrop: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    borderBottomEndRadius: 25,
    borderBottomLeftRadius: 25,
    paddingBottom:26,
    marginBottom:height/3 ,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 5,
    zIndex: 10,
  },
  content: {
    marginTop: height / 2,
    marginHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
  },
 
  icon: {
    height: 30,
    width: 30,
    tintColor: COLORS.secondary,
  },
  employerName: {
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
    color: COLORS.black,
    top: -5,
  },
  publisherContainer:{
     display:'flex',
     flexDirection:'row',
     alignItems:'center',
     justifyContent:'center',
     gap:20,
     marginTop:20,
  },
  publisher: {
    height: 25,
    width: 30,
  },

  imageWrapper: {
    width: 100,
    height: height/8,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    top: -30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    marginTop: 30,
    color: COLORS.black,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: COLORS.black,
    top: 0,
  },

  logo: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 60,
    height: 50,
  },
  box: {
    width: '100%',
    height: height/18,
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 50,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    top: 4,
  },
  holder: {
    height: '100%',
    width: '25%',
    gap: 4,
    borderRightWidth: 1,
    borderColor: COLORS.black,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  holderMiddle: {
    height: '100%',
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRightWidth: 1,
    borderColor: COLORS.black,
  },
  holderLast: {
    height: '100%',
    width: '25%',
    gap: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 14,
    marginBottom: 100,
    color: COLORS.black,
  },

  requirementsContainer: {
    marginTop: 20,
    padding: 5,
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
  },
  requirementsSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // Elevation for Android
    elevation: 5,
  },

  requirementLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  requirementValue: {
    fontSize: 14,
    color: COLORS.darkgray,
  },

  applyButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    zIndex: 10,
  },
  applyButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  closeButton: {
    padding: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 18,
  },
  boldText: {
    color: COLORS.black,
    fontSize:15,
  },
  subHeading: {
    ...FONTS.h4,
    marginBottom: 20,
    marginTop: 10,
    color:COLORS.black,
  },
  listItem: {
    color:COLORS.black,
    marginBottom: 10,
  },
});



export default JobDetailsScreen;
