import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS, icons, images } from '../../constants';
import { fetchuserDetails } from '../../../backend/profile/overview';
import { useUserContext } from '../../hooks/UserContext';
import DotLoader from '../../components/loading/DotLoader';
import { useNavigation } from '@react-navigation/native';
import { resumeStatus } from '../../../backend/resume/resumeStatus';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const OverviewTab = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumeStatusValue, setResumeStatusValue] = useState(false);
  const { userData } = useUserContext();
  const username = userData.username;
  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch user details
        const data = await fetchuserDetails(username);
        setUserDetails(data);

        // Check resume status
        const hasResume = await resumeStatus(username);
        setResumeStatusValue(hasResume);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <DotLoader />
      </View>
    );
  }

 // If resumeStatus is false, show the "Create Resume" view
 if (!resumeStatusValue) {
  return (
    <View style={styles.noDataContainer}>
       <Image source={images.plant} style={styles.no_resume_pic}/>
      <Text style={styles.noDataText}>
        You must create a resume to get an overview.
      </Text>
      <TouchableOpacity
        style={styles.createResumeButton}
        onPress={() => navigation.navigate('Step3')}
      >
        <Text style={styles.createResumeButtonText}>Create Resume</Text>
      </TouchableOpacity>
    </View>
  );
}

  // Edit functions (unchanged)
  const handleEditPersonalInfo = () => {
    navigation.navigate('EditPersonalInfo', { personalDetails: userDetails.personalDetails || {} });
  };

  const handleEditExperience = () => {
    navigation.navigate('EditExperience', { experiences: userDetails.workExperience || [] });
  };

  const handleEditProject = () => {
    navigation.navigate('EditProject', { projects: userDetails.projects || [] });
  };

  const handleEditCertification = () => {
    navigation.navigate('EditCertification', { certifications: userDetails.certifications || [] });
  };

  const handleEditEducation = () => {
    navigation.navigate('EditEducation', { education: userDetails.education || [] });
  };

  const handleEditSkills = () => {
    navigation.navigate('EditSkills', { skills: userDetails.skills || [] });
  };

  const handleEditLanguages = () => {
    navigation.navigate('EditLanguages', { languages: userDetails.languages || [] });
  };

  const handleEditInterests = () => {
    navigation.navigate('EditInterests', { interests: userDetails.interests || [] });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Personal Info */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.heading}>
            <Image source={icons.id_card} style={styles.icon} />
            <Text style={styles.sectionTitle}>Personal Info</Text>
          </View>
          <View>
            <TouchableOpacity onPress={handleEditPersonalInfo}>
              <Image source={icons.edit} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Image source={icons.identity} style={styles.smallIcon} />
          <Text style={styles.infoText}>
            {userDetails.personal?.name || 'N/A'}
          </Text>
        </View>
        <View style={styles.row}>
          <Image source={icons.mail} style={styles.smallIcon} />
          <Text style={styles.infoText}>
            {userDetails.personal?.email || 'N/A'}
          </Text>
        </View>
        <View style={styles.row}>
          <Image source={icons.phone} style={styles.smallIcon} />
          <Text style={styles.infoText}>
            {userDetails.personal?.phone || 'N/A'}
          </Text>
        </View>
        <View style={styles.row}>
          <Image source={icons.location} style={styles.smallIcon} />
          <Text style={styles.infoText}>
            {userDetails.personalDetails?.city || 'N/A'}, {userDetails.personalDetails?.town || 'N/A'}, {userDetails.personalDetails?.country || 'N/A'}
          </Text>
        </View>
      </View>

      {/* Experience */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.heading}>
            <Image source={icons.briefcase} style={styles.icon} />
            <Text style={styles.sectionTitle}>Experience</Text>
          </View>
          <View>
            <TouchableOpacity onPress={handleEditExperience}>
              <Image source={icons.edit} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        {userDetails.workExperience?.map((job, index) => (
          <View key={index}>
            <Text>
              {job.jobTitle || 'N/A'} at {job.company || 'N/A'}
            </Text>
            <Text style={styles.detailText}>{job.location || 'N/A'}</Text>
            <Text style={styles.detailText}>{job.date || 'N/A'}</Text>
          </View>
        ))}
      </View>

      {/* Projects */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.heading}>
            <Image source={icons.project} style={styles.icon} />
            <Text style={styles.sectionTitle}>Projects</Text>
          </View>
          <View>
            <TouchableOpacity onPress={handleEditProject}>
              <Image source={icons.edit} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        {userDetails.projects?.map((project, index) => (
          <View key={index}>
            <Text style={styles.subheading}>{project.projectName || 'N/A'}</Text>
            <Text style={styles.detailText}>{project.projectDescription || 'N/A'}</Text>
            {project.link && (
              <Text style={styles.linkText}>Link: {project.link}</Text>
            )}
          </View>
        ))}
      </View>

      {/* Certifications */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.heading}>
            <Image source={icons.certification} style={styles.icon} />
            <Text style={styles.sectionTitle}>Certifications</Text>
          </View>
          <View>
            <TouchableOpacity onPress={handleEditCertification}>
              <Image source={icons.edit} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        {userDetails.certifications?.map((cert, index) => (
          <View key={index}>
            <Text style={styles.subheading}>{cert.name || 'N/A'}</Text>
            <Text style={styles.detailText}>Issued by {cert.institute || 'N/A'}</Text>
            <Text style={styles.detailText}>{cert.duration || 'N/A'}</Text>
          </View>
        ))}
      </View>

      {/* Education */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.heading}>
            <Image source={icons.education} style={styles.icon} />
            <Text style={styles.sectionTitle}>Education</Text>
          </View>
          <View>
            <TouchableOpacity onPress={handleEditEducation}>
              <Image source={icons.edit} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        {userDetails.education?.map((edu, index) => (
          <View key={index}>
            <Text style={styles.subheading}>{edu.degree || 'N/A'}</Text>
            <Text style={styles.detailText}>{edu.institution || 'N/A'}</Text>
            <Text style={styles.detailText}>{edu.duration || 'N/A'}</Text>
          </View>
        ))}
      </View>

      {/* Skills */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.heading}>
            <Image source={icons.skill} style={styles.icon} />
            <Text style={styles.sectionTitle}>Skills</Text>
          </View>
          <View>
            <TouchableOpacity onPress={handleEditSkills}>
              <Image source={icons.edit} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        {userDetails.skills?.map((skill, index) => (
          <Text key={index} style={styles.infoText}>
            {skill || 'N/A'}
          </Text>
        ))}
      </View>

      {/* Languages */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.heading}>
            <Image source={icons.language} style={styles.icon} />
            <Text style={styles.sectionTitle}>Languages</Text>
          </View>
          <View>
            <TouchableOpacity onPress={handleEditLanguages}>
              <Image source={icons.edit} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        {userDetails.languages?.map((language, index) => (
          <Text key={index} style={styles.infoText}>
            {language || 'N/A'}
          </Text>
        ))}
      </View>

      {/* Interests */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.heading}>
            <Image source={icons.interest} style={styles.icon} />
            <Text style={styles.sectionTitle}>Interests</Text>
          </View>
          <View>
            <TouchableOpacity onPress={handleEditInterests}>
              <Image source={icons.edit} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        {userDetails.interests?.map((interest, index) => (
          <Text key={index} style={styles.infoText}>
            {interest || 'N/A'}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: COLORS.white,
    marginBottom: 60,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.05, // 5% of screen width
  },
  no_resume_pic:{
     height:250,
     width:300,
     objectFit:'contain'
  },
  noDataText: {
    fontSize: width * 0.045, // 4.5% of screen width
    color: COLORS.darkgray,
    textAlign: 'center',
    marginBottom: height * 0.02, // 2% of screen height
  },
  createResumeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: height * 0.02, // 2% of screen height
    paddingHorizontal: width * 0.1, // 10% of screen width
    borderRadius: 8,
  },
  createResumeButtonText: {
    color: COLORS.white,
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation:5,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeader: {
    ...FONTS.h5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  heading: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginLeft: 10,
  },
  smallIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.darkgray,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.darkgray,
    marginBottom: 5,
  },
  subheading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 10,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.darkgray,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: COLORS.darkgray,
    marginBottom: 10,
  },
  margin: {
    marginLeft: '70%',
  },
});

export default OverviewTab;