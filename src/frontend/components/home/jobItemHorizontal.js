import React,{useEffect, useState} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity,Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { icons, COLORS } from '../../constants';
const { width, height } = Dimensions.get('window');
import { useUserContext } from '../../hooks/UserContext';
import { ViewedJob } from '../../../backend/history/viewedJobs';

const JobItemHorizontal = ({ item }) => {
  
  const navigation = useNavigation(); 
  const [logoUrl, setLogoUrl] = useState(null);
  const { userData } = useUserContext();
  const username = userData.username;


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
    <View style={{marginTop:10}}>
    <TouchableOpacity style={styles.jobItemHorizontal}
    onPress={ViewJob}
    >
      <View style={styles.logoContainer}>
   
        <Image
          source={
            logoUrl
              ? { uri: logoUrl } // Use fetched or provided logo
              : icons.suitcase // Fallback to suitcase icon
          }
          style={styles.logo}
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.employerName}>{item.employer_name}</Text>
        <Text style={styles.jobTitle}>{item.job_title.length > 30 ? `${item.job_title.slice(0, 25)}...` : item.job_title}</Text>

        <View style={styles.boxHorizontal}>
          <View style={styles.border}>
            <Text style={styles.location}>{item.job_city  ?item.job_city : 'Online'} . {item.job_is_remote ? 'Remote' : 'Onsite'} . {item.job_employment_type === 'FULLTIME' ? 'Full-Time' : 'Part-Time'}</Text>
          </View>
  
        </View>
      </View>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  jobItemHorizontal: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    paddingHorizontal:20,
    paddingVertical:30,
    top:2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
  },
  logoContainer: {
    height: 80,
    width: 80,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden', // Ensures the logo doesn't overflow the container
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  employerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 14,
    color: '#555',
  },
  boxHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    height:'30%',
    left:-15,
  },
  border: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginHorizontal:3,
    height:40,
  },
  location: {
    fontSize: 14,
    color: '#000',
  },
  publisher: {
    fontSize: 14,
    color: '#000',
  },
  jobType: {
    fontSize: 14,
    color: '#000',
  },
});

export default JobItemHorizontal;
