import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { icons, COLORS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../../hooks/UserContext';
import { saveJob } from '../../../backend/profile/savedJob';
import { ViewedJob } from '../../../backend/history/viewedJobs';

const { width, height } = Dimensions.get('window');

const JobItem = ({ item }) => {
  const { userData } = useUserContext();
  const username = userData.username;

  const navigation = useNavigation();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);

  // Fetch logo from Clearbit API
  useEffect(() => {
    const fetchLogo = async () => {
      if (!item.employer_logo) {
        try {
          const domain = `${item.employer_name.replace(/\s+/g, '').toLowerCase()}.com`;
          const clearbitLogoUrl = `https://logo.clearbit.com/${domain}`;
          const response = await fetch(clearbitLogoUrl);
  
          if (response.ok) {
            setLogoUrl(clearbitLogoUrl); // Logo found
            console.log(`Logo loaded successfully from Clearbit: ${clearbitLogoUrl}`);
          } else {
            setLogoUrl(null); // Clearbit logo not found
            console.log(`Clearbit logo not found for domain: ${domain}`);
          }
        } catch (error) {
          console.error('Error fetching logo:', error);
          setLogoUrl(null);
        }
      } else {
        setLogoUrl(item.employer_logo); // Use provided employer logo
        console.log(`Using provided employer logo: ${item.employer_logo}`);
      }
    };
  
    fetchLogo();
  }, [item.employer_logo, item.employer_name]);
  

  const handleBookmark = () => {
    if (!isBookmarked) {
      setIsBookmarked(true); // Update the state to bookmarked
      saveJob(item, username); // Save the job
      setModalVisible(true); // Show the modal
      setTimeout(() => {
        setModalVisible(false); // Hide the modal after 2 seconds
      }, 2000);
    }
  };

  const ViewJob = async () => {
    try{
      ViewedJob(item, username);
      console.log('Viewed Job Saved');
      navigation.navigate('JobDetailScreen', { job: item })

    } catch (error){
        console.log('Viewed job not saved', err)
    }
  }

  return (
    <TouchableOpacity
      style={styles.jobItem}
      onPress={ViewJob}
     
    >
      <View style={{ height: 50, width: 50, top: 5 }}>
        <Image
          source={
            logoUrl
              ? { uri: logoUrl } // Use fetched or provided logo
              : icons.suitcase // Fallback to suitcase icon
          }
          style={styles.logo}
        />
      </View>

      <View style={styles.box}>
        {/* Employer name */}
        <Text style={styles.employerNameList}>
          {item.employer_name.length > 30
            ? `${item.employer_name.slice(0, 25)}...`
            : item.employer_name}
        </Text>

        {/* Job title */}
        <Text style={styles.jobTitle}>
          {item.job_title.length > 35
            ? `${item.job_title.slice(0, 30)}...`
            : item.job_title}
        </Text>

        {/* Job Link */}
        {item.job_google_link && (
          <View style={styles.google}>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('jobWebViewScreen', {
                  url: item.job_apply_link,
                })
              }
            >
              <Image source={icons.google} style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}

        {/* Job details */}
        <View style={styles.detailsContainer}>
          <View style={{ flexDirection: 'row', gap: 2 }}>
            <Image source={icons.earth} style={styles.icon} />
            <Text style={styles.detailText}>
              {item.job_city ? item.job_city : 'Online'},{item.job_country}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 2 }}>
            <Image source={icons.marker} style={styles.icon} />
            <Text style={styles.detailText}>
              {item.job_is_remote ? 'Remote' : 'Onsite'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 2 }}>
            <Image source={icons.duration} style={styles.icon} />
            <Text style={styles.detailText}>
              {item.job_employment_type === 'FULLTIME'
                ? 'Full-Time'
                : 'Part-Time'}
            </Text>
          </View>

          {/* Bookmark Icon */}
          <TouchableOpacity onPress={handleBookmark} disabled={isBookmarked}>
            <Image
              style={[
                styles.save,
                { tintColor: isBookmarked ? COLORS.secondary : COLORS.darkgray },
              ]}
              source={icons.bookmark}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Bookmarked!</Text>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  jobItem: {
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkgray,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    gap: 20,
    height: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  box: {
    height: height * 0.09,
    width: '80%',
    gap: 4,
    top: '14%',
  },
  employerNameList: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.darkgray,
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    top: '60%',
  },
  icon: {
    height: 15,
    width: 15,
  },
  save: {
    height: 15,
    width: 15,
    left: '80%',
    position:'absolute'
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  detailText: {
    color: COLORS.black,
    fontSize: 12,
  },
  google: {
    top: -10,
    position: 'absolute',
    left: '80%',
  },
  button: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.lightGray4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JobItem;
