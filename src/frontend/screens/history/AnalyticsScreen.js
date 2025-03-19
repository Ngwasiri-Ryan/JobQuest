import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, icons, FONTS } from '../../constants';
import AnalysisTab from './AnalysisTab';
import ListTab from './ListTab';
import ActivitiesTab from './ActivitiesTab';



const AnalyticsScreen = ({navigation}) => {
  const [activeCategory, setActiveCategory] = useState('list');


  const getCurrentDate = () => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options); // Format: "October 5, 2024"
  };


  const renderContent = () => {
    switch (activeCategory) {
      case 'list':
        return renderList();
      case 'analysis':
        return renderAnalysis();
      default:
        return renderActivity();
    }
  };

  // Render the List component
  const renderList = () =>  <ListTab/>;
  
  // Render the Analysis component
  const renderAnalysis = () => <AnalysisTab />;

  const renderActivity = () => <ActivitiesTab />;
  
  const goBack = () => {
    navigation.goBack(); // This assumes you're using react-navigation
  };

  return (
    <View style={styles.container}>
      {/* First Section */}
      <SafeAreaView style={styles.whitebackground}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
          <Image source={icons.back} style={[styles.icon, {tintColor:'white'}]} />
          </TouchableOpacity>
          <Image source={icons.analytics} style={styles.icon} />
        </View>

        <View style={styles.headingView}>
          <View>
            <Text style={styles.haedingText}>My Analysis</Text>
            <Text style={styles.smallText}>Summary</Text>
          </View>
          <View style={styles.dateHolder}>
            <View style={styles.calendarIconHolder}>
              <Image source={icons.calendar} style={styles.calendarIcon} />
            </View>
            <View style={styles.dateInfo}>
              <Text style={styles.dateText}>{getCurrentDate()}</Text>
              <Text style={styles.text}>Activity up by 18%</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Tabs */}
      <View style={styles.tab}>
        <View style={styles.categoryheadingHolder}>
          <Text style={styles.categorItemTitle}>CATEGORIES</Text>
          <Text style={styles.text}>5 total</Text>
        </View>
        <View style={styles.categoryHolder}>
          {/* Analysis Tab */}
          <TouchableOpacity
            style={[
              styles.categoryItemHolder,
              activeCategory === 'analysis' && styles.activeCategory,
            ]}
            onPress={() => setActiveCategory('analysis')}
          >
            <Image
              source={icons.stats}
              style={[
                styles.categoryIcon,
                activeCategory === 'analysis' && styles.activeCategoryIcon,
              ]}
            />
          </TouchableOpacity>



           {/* Activity Tab */}
           <TouchableOpacity
            style={[
              styles.categoryItemHolder,
              activeCategory === 'activity' && styles.activeCategory,
            ]}
            onPress={() => setActiveCategory('activity')}
          >
            <Image
              source={icons.chart}
              style={[
                styles.categoryIcon,
                activeCategory === 'activity' && styles.activeCategoryIcon,
              ]}
            />
          </TouchableOpacity>


          {/* List Tab */}
          <TouchableOpacity
            style={[
              styles.categoryItemHolder,
              activeCategory === 'list' && styles.activeCategory,
            ]}
            onPress={() => setActiveCategory('list')}
          >
            <Image
              source={icons.list}
              style={[
                styles.categoryIcon,
                activeCategory === 'list' && styles.activeCategoryIcon,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
  {renderContent()}
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    height: 30,
    width: 30,
  },
  whitebackground: {
    backgroundColor: COLORS.black,
    paddingBottom: 20,
    paddingHorizontal:15,
    borderBottomRightRadius:20,
    borderBottomLeftRadius:20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 20,
    justifyContent: 'space-between',
    
  },
  haedingText: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  smallText: {
    ...FONTS.body3,
    marginBottom: 20,
    color: COLORS.white,
  },
  calendarIconHolder: {
    backgroundColor: COLORS.lightGray3,
    borderRadius: 50,
    height: 50,
    width: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateHolder: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    marginTop: 5,
    alignItems: 'flex-start',
  },
  dateInfo: {
    top: 2,
  },
  text:{
    ...FONTS.h5,
    color:COLORS.white,
    top:5,
  },
  dateText: {
    ...FONTS.h4,
    color:COLORS.white,
  },
  categoryItemHolder: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: COLORS.lightGray3,
    height: 40,
    width: 40,
  },
  calendarIcon:{
     height:20,
     width:20,
  },
  categoryIcon: {
    height: 20,
    width: 20,
  },
  tab: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  categoryHolder: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categorItemTitle: {
    ...FONTS.h4,
    color: COLORS.black,
  },
  activeCategory: {
    backgroundColor: COLORS.primary,
  },
  activeCategoryIcon: {
    tintColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray3,
  },
  title: {
    ...FONTS.h4,
    color: COLORS.black,
  },
  subtitle: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  date: {
    ...FONTS.body5,
    color: COLORS.lightGray,
  },
});

export default AnalyticsScreen;
