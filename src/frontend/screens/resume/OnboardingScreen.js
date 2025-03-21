
import React, { useRef, useState } from 'react';
import { COLORS, images,FONTS } from '../../constants'; 
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';


const slides = [
  {
    id: '1',
    image: images.resume,
    title: 'Welcome to Your Resume Builder',
    description: 'Ready to create a standout resume? Let’s walk through each step to build a resume that impresses.',
  },
  {
    id: '2',
    image: images.resume_template,
    title: 'Start with Personal Information',
    description: 'Add your name, phone number, email, and LinkedIn profile at the top. Make sure your contact details are up to date.',
  },
  {
    id: '3',
    image: images.edit_resume,
    title: 'Craft a Professional Summary',
    description: 'Write a brief summary that highlights your career goals, key skills, and achievements. Keep it concise and impactful.',
  },
  {
    id: '4',
    image: images.resume_folder,
    title: 'Showcase Your Skills and Experience',
    description: 'Focus on relevant skills and past experiences that match the job description. Use bullet points for clarity.',
  },
  {
    id: '5',
    image: images.resume_format,
    title: 'Finalize and Format',
    description: 'Review your resume for errors. Ensure clear headings, consistent fonts, and professional spacing to make it stand out.',
  },
];

  

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      flatListRef.current.scrollToIndex({ index: newIndex });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
          setCurrentIndex(index);
        }}
        ref={flatListRef}
      />
      
      {/* Dots for the slides */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index ? styles.activeDot : styles.inactiveDot]}
          />
        ))}
      </View>
      
      {/* Static View with Text and Get Started Button */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Ready to get started?</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DocumentBuilderScreen')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:COLORS.white
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  image: {
    width: '100%',
    height: 250, // Set your preferred height
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 10,
    ...FONTS.h2,
    ...COLORS.darkgray
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color:COLORS.black,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 15, // Active dot is wider
  },
  inactiveDot: {
    backgroundColor: '#e0e0e0',
  },
  footer: {
    alignItems: 'center',
    height: height / 3.7,
    width:width,
    borderTopLeftRadius:50,
    borderTopRightRadius:50,
    justifyContent: 'center',
    marginTop: 10,
    paddingBottom: 60,
    backgroundColor: '#fff', 
  },
  footerText: {
    marginBottom: 15,
    textAlign: 'center',
    ...FONTS.body3
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal:50,
    padding: 15,
    borderRadius: 50,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    ...FONTS.body2
  },
});

export default OnboardingScreen;
