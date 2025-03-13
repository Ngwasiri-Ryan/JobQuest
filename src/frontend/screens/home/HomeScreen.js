import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import axios from 'axios';
import JobItemHorizontal from '../../components/home/jobItemHorizontal';
import JobItem from '../../components/home/jobItem';
import Error from '../../components/search/Error';
import RequestError from '../../components/search/429_error'; 
import { COLORS, FONTS, icons } from '../../constants';
import Loader from '../../components/loading/Loader';
import Greetings from '../../components/home/Greetings';
import { useUserContext } from '../../hooks/UserContext';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ route, navigation }) => {
  const { userData } = useUserContext();
  const username = userData?.username;
  const firstLetter = username?.charAt(0).toUpperCase() || '?';
  const { selectedJobs } = route.params || {};
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [is429Error, setIs429Error] = useState(false);

  const categories = [
    { name: 'All', type: 'FULLTIME' },
    { name: 'Full-Time', type: 'FULLTIME' },
    { name: 'Part-Time', type: 'PARTTIME' },
    { name: 'Contract', type: 'CONTRACT' },
    { name: 'Internship', type: 'INTERN' },
    { name: 'Freelance', type: 'FREELANCE' },
  ];

  const fetchJobs = async (retryCount = 0, page = 1) => {
    const query = selectedJobs.join();

    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query: `${query}`,
        page: page.toString(),
        num_pages: '15',
        country: 'us',
        date_posted: 'all'
      },
      headers: {
        'x-rapidapi-key': '7fd213d47emshb49cf8bd294a249p1de61ajsn820c90d640ca',
        'x-rapidapi-host': 'jsearch.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      setJobs((prevJobs) => [...prevJobs, ...response.data.data]);
      setFilteredJobs((prevJobs) => [...prevJobs, ...response.data.data]);

      if (page < response.data.total_pages) {
        fetchJobs(retryCount, page + 1);
      } else {
        setLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 429 && retryCount < 3) {
        setTimeout(() => fetchJobs(retryCount + 1, page), 2000);
      } else if (error.response && error.response.status === 429) {
        setIs429Error(true);
        setLoading(false);
      } else {
        setError(error.message);
        console.log(error.message);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedJobs]);

  useEffect(() => {
    filterJobs();
  }, [jobs, filter, selectedCategory]);

  const filterJobs = () => {
    let filtered = jobs;
    if (filter === 'remote') {
      filtered = filtered.filter((job) => job.job_is_remote);
    } else if (filter === 'onsite') {
      filtered = filtered.filter((job) => !job.job_is_remote);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((job) => job.job_employment_type === selectedCategory);
    }

    setFilteredJobs(filtered);
  };

  const reload = () => {
    setLoading(true);
    setError(null);
    setIs429Error(false);
    setJobs([]);
    setFilteredJobs([]);
    fetchJobs();
  };

  if (loading) {
    return <Loader />; // Your existing loader component
  }

  if (is429Error) {
    return (
      <View style={styles.errorContainer}>
        <RequestError />
        <TouchableOpacity onPress={reload} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Error />
        <TouchableOpacity onPress={reload} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const firstFiveJobs = filteredJobs.slice(0, 6);
  const remainingJobs = filteredJobs.slice(6);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profile} onPress={() => navigation.navigate('ProfileScreen')}>
          <Text style={styles.profileText}>{firstLetter}</Text>
        </TouchableOpacity>
        <View>
          <Greetings />
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.heading}>Available Jobs</Text>
        <TouchableOpacity style={styles.search} onPress={() => navigation.navigate('FindjobScreen')}>
          <Image source={icons.search} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.newsContainer} onPress={() => navigation.navigate('NewsScreen')}>
        <Text style={styles.smallHeading}>
          Get the latest news on your job hunting on
        </Text>
        <View >
          <Image source={icons.news_logo} style={styles.newsLogo} />
        </View>
      </TouchableOpacity> 

      <Text style={styles.smallheading}>Job Type</Text>
      <View>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.type}
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item.type)}
              style={[styles.filterButton, selectedCategory === item.type && styles.selectedCategoryButton]}
            >
              <Text style={selectedCategory === item.type ? styles.selectedCategoryText : styles.categoryText}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {firstFiveJobs.map((item, index) => (
          <JobItemHorizontal key={`${item.job_id}-${index}`} item={item} />
        ))}
      </ScrollView>

      <FlatList
        data={remainingJobs}
        keyExtractor={(item) => item.job_id || item.id || Math.random().toString(36).substr(2, 9)}
        renderItem={({ item }) => <JobItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.white,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.black,
  },
  smallheading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.black,
    paddingHorizontal: 10,
  },
  profileText: {
    color: COLORS.white,
    ...FONTS.h2,
  },
  header: {
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  search: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  icon: {
    height: 20,
    width: 20,
    tintColor: COLORS.white,
  },
    newsContainer: {
      backgroundColor: '#B3E5FC',
      borderRadius: 10,
      alignItems: "center", // Centers content horizontally
      justifyContent: "center", // Centers content vertically
      marginVertical: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2, // For Android shadow
      paddingTop:10,
    },
    smallHeading: {
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
      textAlign: "center",
      marginBottom: 12, // Space between text and image
    },
    newsLogo: {
      width: 200, // Adjust based on logo size
      height: 60, // Adjust based on logo size
      resizeMode: "contain",
    },
  categoryScroll: {
    paddingVertical: 5,
    height: 60,
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.secondary,
    borderColor: 'transparent',
  },
  categoryText: {
    color: COLORS.black,
  },
  selectedCategoryText: {
    fontSize: 14,
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap:5,
  },
  filterButton: {
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    marginRight: 10,
    borderColor: '#000',
    borderWidth: 1,
  },
  profile: {
    height: 40,
    width: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 5,
  },
  horizontalScroll: {
    paddingVertical: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton:{
    backgroundColor:COLORS.primary,
    padding:10,
    justifyContent:'center',
    alignItems:'center',
    display:'flex',
    top:-250,
    width:100,
    borderRadius:20,
  },
  retryText:{
    fontSize:16,
    color: COLORS.white,
  }
});

export default HomeScreen;
