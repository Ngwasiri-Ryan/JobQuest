import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, images } from '../../constants';
import { useUserContext } from '../../hooks/UserContext';
import { fetchSavedJobs } from '../../../backend/profile/fetchSavedJobs';
import { deleteSavedJob } from '../../../backend/profile/deleteSavedJob'; 
import { useNavigation } from '@react-navigation/native';
import { icons } from '../../constants';
import { timeAgo } from '../../hooks/TimeSaved';
import DotLoader from '../../components/loading/DotLoader';

const SavedJobsTab = () => {
  const { userData } = useUserContext();
  const username = userData?.username;
  const navigation = useNavigation();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // Manage modal visibility
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        const jobs = await fetchSavedJobs(username);
        setSavedJobs(jobs);
      } catch (error) {
        console.error('Error loading saved jobs:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSavedJobs();
  }, [username]);

  const handleDeleteJob = async jobId => {
    try {
      await deleteSavedJob(jobId, username); // Call the delete function
      setModalMessage('Saved job removed');
      setModalVisible(true);

      // Update the saved jobs state to remove the deleted job
      setSavedJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
       <DotLoader/>
      </View>
    );
  }

  if (savedJobs.length === 0) {
    return (
      <View style={styles.mid_container}>
        <Image source={images.no_saved_jobs} style={styles.no_saved_jobs}/>
        <Text style={styles.noJobsText}>No saved jobs yet.</Text>
      </View>
    );
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.justify}>
      <Text style={styles.heading}>Saved Jobs</Text>
      <Text style={styles.smallText}>{savedJobs.length} Jobs saved</Text>
      </View>
      
      <FlatList
        data={savedJobs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('JobDetailScreen', { job: item })}>
            <View style={styles.jobItem}>
              {/* Company logo */}
              {item.employer_logo ? (
                <View style={{ height: 50, width: 50 }}>
                  <Image source={{ uri: item.employer_logo }} style={styles.logo} />
                </View>
              ) : (
                <View style={{ height: 50, width: 50 }}>
                  <Image
                    source={icons.suitcase}
                    style={styles.logo}
                  />
                </View>
              )}
              <View style={{ width: '80%' }}>
                <View style={styles.justify}>
                  <Text style={styles.jobTitle}>
                    {item.job_title.length > 35
                      ? `${item.job_title.slice(0, 30)}...`
                      : item.job_title}
                  </Text>
                  {/* Delete icon */}
                  {/* <TouchableOpacity
                    onPress={() => handleDeleteJob(item.id)} // Handle delete on click
                    style={styles.deleteIcon}>
                    <Image source={icons.trash} style={styles.trash} />
                  </TouchableOpacity> */}
                </View>

                <Text style={styles.employerNameList}>
                  {item.employer_name.length > 30
                    ? `${item.employer_name.slice(0, 25)}...`
                    : item.employer_name}
                </Text>

                {/* Display saved time */}
                <Text style={styles.timeSaved}>
                  {timeAgo(item.savedAt)} {/* Format the savedAt time */}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    marginBottom:70
  },
  mid_container:{
    flex: 1,
    marginBottom:70,
    justifyContent:'center',
    alignItems:'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top:'100%',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
  },
  logo: {
    height: '100%',
    width: '100%',
  },
  justify: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
no_saved_jobs:{
   height:350,
   width:300,
},
  noJobsText: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginTop: 20,
  },
  smallText: {
    color: COLORS.darkgray,
    ...FONTS.body4,
  },
  jobItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    borderBottomColor: COLORS.black,
     },
  jobTitle: {
    ...FONTS.h5,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  employerNameList: {
    fontSize: 14,
    color: COLORS.darkgray,
  },
  timeSaved: {
    fontSize: 12,
    color: COLORS.darkgray,
    marginTop: 5,
  },
  icon: {
    height: 15,
    width: 15,
  },
  trash: {
    height: 20,
    width: 15,
    tintColor: 'red',
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  modal: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default SavedJobsTab;
