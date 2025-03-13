import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { COLORS, FONTS, icons } from '../../constants';


const JobSelectionScreen = ({ navigation }) => {
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [search, setSearch] = useState('');

  const jobCategories = {
    "Tech": [
      { name: "Developer", image: icons.developer },
      { name: "UI/UX Designer", image: icons.design },
      { name: "Data Scientist", image: icons.data_science },
      { name: "Product Manager", image: icons.product_development },
    ],
    "Design": [
      { name: "Graphic Designer", image: icons.graphics },
      { name: "Animator", image: icons.animator },
      { name: "Illustrator", image: icons.Illustrator },
    ],
    "Business": [
      { name: "Marketing", image: icons.graph },
      { name: "Sales", image: icons.sales },
      { name: "Accounting", image: icons.calculator },
      { name: "Project Manager", image: icons.folder },
    ],
    "Healthcare": [
      { name: "Nurse", image: icons.nurse },
      { name: "Doctor", image: icons.doctor },
      { name: "Pharmacist", image: icons.pill_jar },
    ],
    "Education": [
      { name: "Teacher", image: icons.teacher },
      { name: "Tutor", image: icons.tutor },
      { name: "Professor", image: icons.professor },
      { name: "Researcher", image: icons.research },
    ],
  };

  const handleNext = () => {
    navigation.navigate('Main', { screen: 'Home', params: { selectedJobs } });
  };

  const toggleSelection = (job) => {
    setSelectedJobs((prev) =>
      prev.includes(job) ? prev.filter((item) => item !== job) : [...prev, job]
    );
  };

  const filteredJobCategories = Object.keys(jobCategories).reduce((acc, category) => {
    const filteredJobs = jobCategories[category].filter((job) =>
      job.name.toLowerCase().includes(search.toLowerCase())
    );
    if (filteredJobs.length) acc[category] = filteredJobs;
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Select the Jobs You Do</Text>
        {Object.keys(filteredJobCategories).map((category) => (
          <View key={category} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <View style={styles.jobList}>
              {filteredJobCategories[category].map((job) => (
                <TouchableOpacity
                  key={job.name}
                  style={[
                    styles.option,
                    selectedJobs.includes(job.name) && styles.selectedOption,
                  ]}
                  onPress={() => toggleSelection(job.name)}
                >
                  <Image
                    source={job.image}
                    style={[
                      styles.jobImage,
                      selectedJobs.includes(job.name) && styles.selectedImage,
                    ]}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      selectedJobs.includes(job.name) && styles.selectedOptionText,
                    ]}
                  >
                    {job.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: COLORS.white,
    justifyContent:'center',
    alignItems:'center'
  },
  stepText: {
    textAlign: 'center',
    color: COLORS.black,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.lightGray1,
    marginBottom: 20,
    textAlign: 'center',
    ...FONTS.h1,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 10,
  },
  jobList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    width: '48%',
    alignItems: 'center',
    ...FONTS.body5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 5,
  },
  selectedOption: {
    backgroundColor: COLORS.secondary,
  },
  jobImage: {
    width: 30,
    height: 30,
    marginBottom: 8,
    tintColor: '#000',
  },
  selectedImage: {
    tintColor: COLORS.white,
  },
  optionText: {
    color: COLORS.black,
  },
  selectedOptionText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    width:'80%'
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
    ...FONTS.h2,
  },
});

export default JobSelectionScreen;
