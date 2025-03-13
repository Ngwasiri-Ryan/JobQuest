import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import axios from 'axios';
import { icons, COLORS } from '../../constants';
import Search from '../../components/search/Search';
import { useNavigation } from '@react-navigation/native';
import NoResults from '../../components/search/NoResults';
import Loader from '../../components/loading/Loader';
import { useUserContext } from '../../hooks/UserContext';
import { saveSearchHistory } from '../../../backend/history/searchHistory';

import JobItem from '../../components/home/jobItem';

const { width, height } = Dimensions.get('window'); 

const FindjobScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { userData } = useUserContext();
  const username = userData?.username;

  const searchJobs = async () => {
    if (!query.trim()) return; 
    setLoading(true);
    setSearchPerformed(true);

    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query: query,
        page:  '1',
        num_pages:'15' ,
        country: location,
        date_posted: 'all'
      },
      headers: {
        'x-rapidapi-key': '7fd213d47emshb49cf8bd294a249p1de61ajsn820c90d640ca',
        'x-rapidapi-host': 'jsearch.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      setJobs(response.data.data || []); // Handle potential empty data
      if (username) saveSearchHistory(username, query); // Save search history if user is logged in
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderJobItem = ({ item }) => {
    return <JobItem item={item} />; // Use JobItem component for each job
  };

  return (
    <View style={styles.container}>
      <View style={styles.backdrop}>
        {/* Back icon */}
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Image source={icons.back} style={styles.back} />
        </TouchableOpacity>

        <Text style={styles.heading}>Job Search</Text>
        <View style={styles.inputHolders}>
          <View style={styles.inputWrapper}>
            <View style={styles.inputHolder}> 
              <Image source={icons.job} style={styles.icons} />
              <TextInput
                style={[styles.searchInput]}
                placeholder="Enter job title or keyword..."
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={searchJobs}
              />
            </View>
            
            <View style={styles.inputHolder}> 
              <Image source={icons.location} style={styles.icons} />
              <TextInput
                style={[styles.searchInput]}
                placeholder="Enter job location..."
                value={location}
                onChangeText={setLocation}
                onSubmitEditing={searchJobs}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={searchJobs}>
            <Image source={icons.search} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.job_id}
          renderItem={renderJobItem} // Render each job using the JobItem component
          ListEmptyComponent={
            searchPerformed ? <NoResults /> : <Search />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  backdrop: {
    paddingBottom: height * 0.02,
    backgroundColor: COLORS.white,
    paddingHorizontal: width * 0.05,
    paddingBottom: width * 0.05,
    borderBottomEndRadius: 25,
    borderBottomLeftRadius: 25,
    width: '100%',
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
  backIcon: {
    position: 'absolute',
    left: width * 0.03,
    padding: 10,
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
    color: COLORS.black,
  },
  inputHolders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  inputWrapper: {
    flexDirection: 'column',
    flex: 1,
    gap: height * 0.015,
    justifyContent: 'center',
  },
  searchInput: {
    height: height * 0.065,
    borderWidth: 1,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.01,
    width: '100%',
    borderColor: 'transparent',
    color: COLORS.black,
    fontSize: 15,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.02,
  },
  icon: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: '#fff',
  },
  back: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: 'black',
  },
  icons: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: COLORS.black,
  },
  inputHolder: {
    flexDirection: 'row',
    gap: width * 0.02,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: width * 0.05,
    borderRadius: 30,
  },
});

export default FindjobScreen;
