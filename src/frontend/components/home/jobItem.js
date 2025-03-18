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

const { width } = Dimensions.get('window');

const JobItem = ({ item }) => {
  const { userData } = useUserContext();
  const username = userData.username;
  const navigation = useNavigation();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoUrl, setLogoUrl] = useState(item.employer_logo || null);

  useEffect(() => {
    if (!item.employer_logo) {
      const fetchLogo = async () => {
        try {
          const domain = `${item.employer_name.replace(/\s+/g, '').toLowerCase()}.com`;
          const clearbitLogoUrl = `https://logo.clearbit.com/${domain}`;
          const response = await fetch(clearbitLogoUrl);

          if (response.ok) {
            setLogoUrl(clearbitLogoUrl);
          }
        } catch (error) {
          console.error('Error fetching logo:', error);
        }
      };
      fetchLogo();
    }
  }, [item.employer_logo, item.employer_name]);

  const handleBookmark = () => {
    if (!isBookmarked) {
      setIsBookmarked(true);
      saveJob(item, username);
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);
    }
  };

  const handleJobPress = async () => {
    try {
      await ViewedJob(item, username);
      navigation.navigate('JobDetailScreen', { job: item });
    } catch (error) {
      console.error('Error saving viewed job:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.jobItem} onPress={handleJobPress}>
      <Image
        source={logoUrl ? { uri: logoUrl } : icons.suitcase}
        style={styles.logo}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.jobTitle} numberOfLines={1}>{item.job_title}</Text>
        <Text style={styles.employerName} numberOfLines={1}>{item.employer_name}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Image source={icons.earth} style={styles.icon} />
            <Text style={styles.detailText}>{item.job_city || 'Online'}, {item.job_country}</Text>
          </View>

          <View style={styles.detailRow}>
            <Image source={icons.marker} style={styles.icon} />
            <Text style={styles.detailText}>{item.job_is_remote ? 'Remote' : 'Onsite'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Image source={icons.duration} style={styles.icon} />
            <Text style={styles.detailText}>{item.job_employment_type === 'FULLTIME' ? 'Full-Time' : 'Part-Time'}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={handleBookmark} disabled={isBookmarked}>
        <Image
          style={[styles.bookmarkIcon, { tintColor: isBookmarked ? COLORS.secondary : COLORS.darkgray }]}
          source={icons.bookmark}
        />
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="slide">
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    marginVertical: 8,
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 4,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
    gap:5,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  employerName: {
    fontSize: 14,
    color: COLORS.gray,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.black,
  },
  bookmarkIcon: {
    width: 20,
    height: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default JobItem;
