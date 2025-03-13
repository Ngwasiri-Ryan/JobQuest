import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import {COLORS, icons} from '../../constants';

const {width, height} = Dimensions.get('window');

const categories = [
  {id: 1, name: 'Jobs'},
  {id: 2, name: 'Salary'},
  {id: 3, name: 'Hiring Trends'},
  {id: 4, name: 'Job Interviews'},
  {id: 5, name: 'Career Advice'},
  {id: 6, name: 'Resume Tips'},
  {id: 7, name: 'Remote Work'},
  {id: 8, name: 'Freelancing'},
  {id: 9, name: 'Part-Time Jobs'},
  {id: 10, name: 'Internships'},
  {id: 11, name: 'Work-Life Balance'},
  {id: 12, name: 'Employee Benefits'},
  {id: 13, name: 'Networking'},
  {id: 14, name: 'Skill Development'},
  {id: 15, name: 'Workplace Culture'},
  {id: 16, name: 'Diversity and Inclusion'},
  {id: 17, name: 'Technology Jobs'},
  {id: 18, name: 'Healthcare Careers'},
  {id: 19, name: 'Education Jobs'},
  {id: 20, name: 'Finance Jobs'},
  {id: 21, name: 'Government Jobs'},
  {id: 22, name: 'Engineering Jobs'},
  {id: 23, name: 'Marketing Careers'},
  {id: 24, name: 'Creative Jobs'},
  {id: 25, name: 'Legal Jobs'},
  {id: 26, name: 'Customer Support'},
  {id: 27, name: 'Entrepreneurship'},
  {id: 28, name: 'Leadership Skills'},
  {id: 29, name: 'Startup Culture'},
  {id: 30, name: 'Gig Economy'},
  {id: 31, name: 'Corporate Jobs'},
  {id: 32, name: 'Job Market Trends'},
  {id: 33, name: 'Job Search Tools'},
  {id: 34, name: 'Professional Growth'},
  {id: 35, name: 'Recruitment'},
  {id: 36, name: 'Soft Skills'},
  {id: 37, name: 'Workplace Challenges'},
  {id: 38, name: 'Job Descriptions'},
  {id: 39, name: 'Remote Work Tools'},
  {id: 40, name: 'Contract Work'},
  {id: 41, name: 'Job Offers'},
  {id: 42, name: 'Company Reviews'},
  {id: 43, name: 'Interview Questions'},
  {id: 44, name: 'Salary Negotiation'},
  {id: 45, name: 'Global Job Market'},
  {id: 46, name: 'Future of Work'},
  {id: 47, name: 'Artificial Intelligence Careers'},
  {id: 48, name: 'Green Jobs'},
  {id: 49, name: 'Volunteer Work'},
  {id: 50, name: 'Job Satisfaction'},
];


const NewsScreen = ({navigation}) => {
  const [selectedCategory, setSelectedCategory] = useState('Jobs');
  const [newsData, setNewsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNews = async query => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${query}&apiKey=793880b566c84f45a55799733ed1ac26`,
      );
      setNewsData(response.data.articles);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch news');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchNews(searchQuery);
    }
  };

  const renderCategory = ({item}) => {
    const isSelected = item.name === selectedCategory;

    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          isSelected && {backgroundColor: COLORS.primary},
        ]}
        onPress={() => setSelectedCategory(item.name)}>
        <Text
          style={[styles.categoryText, isSelected && {color: COLORS.white}]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderNewsItem = ({item}) => {
    if (!item.title || !item.urlToImage) {
      return null;
    }
    
    const displayName = item.source.name || 'Unknown Source';
  
    const domain = displayName.toLowerCase().replace(/\s+/g, '') + '.com';
  
    const logoUrl = `https://logo.clearbit.com/${domain}`;

    return (
      <TouchableOpacity
        style={styles.newsItem}
        onPress={() => navigation.navigate('QuestBrowserScreen', {url: item.url})}>
        <Image
          source={{uri: item.urlToImage}}
          style={styles.newsImage}
          resizeMode="cover"
        />
        <View style={styles.newsContent}>
          <Text style={styles.newsTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.newsDescription} numberOfLines={3}>
            {item.description}
          </Text>
          <View style={styles.newsFooter}>
            <View style={styles.holder}>
            <Image source={{ uri: logoUrl }} style={styles.logoPublisher} />
            <Text style={styles.newsSource}>
              {item.source.name || 'Unknown Source'}
            </Text>
            </View>
            <Text style={styles.newsDate}>
              {new Date(item.publishedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={100} color= {COLORS.primary}/>
        <Text>Loading news...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchNews(selectedCategory)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <Text style={styles.retryButtonText}>Connection error</Text>
      </View>
    );
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.back} style={styles.icon} />
        </TouchableOpacity>
        <Image source={icons.news_logo} style={styles.logo} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search news..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Image source={icons.search} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      <View>

      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      />
      </View>

<View>
<FlatList
        data={newsData}
        renderItem={renderNewsItem}
        keyExtractor={item => item.url}
        contentContainerStyle={styles.listContainer}
      />
</View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: width * 0.18,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    marginTop: width * 0.05,
    marginLeft: width * 0.2,
  },
  searchIcon: {
    width: 25,
    height: 25,
    tintColor:COLORS.white
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal:10,
    backgroundColor: COLORS.white,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  categoryButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.black,
    backgroundColor: COLORS.white,
    minWidth: width * 0.25,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  newsItem: {
    marginBottom: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  newsContent: {
    padding: 15,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 5,
  },
  newsDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsSource: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight:'bold',
  },
  newsDate: {
    fontSize: 14,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap:5,
  },
  holder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, 
  },
  logoPublisher: {
    width: 40,
    height: 40,
    borderRadius: 15, 
    backgroundColor: '#f0f0f0',
  },
});

export default NewsScreen;
