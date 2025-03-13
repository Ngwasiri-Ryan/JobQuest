import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Dimensions , Image} from 'react-native'
import DonutChart from '../../components/analytics/DonutChart';
import { COLORS, FONTS, images } from '../../constants';
import { useUserContext } from '../../hooks/UserContext';
import { countSavedJobs } from '../../../backend/analysis/savedJobsCount';
import { getNumberOfAppliedJobs } from '../../../backend/history/appliedJobs';
import { getUserChatSearchCount } from '../../../backend/history/chatHistory';
import { countUserSearches } from '../../../backend/history/searchHistory';
import { getViewedJobCount } from '../../../backend/history/viewedJobs';

const { width, height } = Dimensions.get('window');

const AnalysisTab = () => {
  const { userData } = useUserContext();
  const username = userData?.username;

  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      try {
        const [
          savedJobsCount,
          appliedJobsCount,
          chatCount,
          searchCount,
          viewedJobCount,
        ] = await Promise.all([
          countSavedJobs(username) || 0,
          getNumberOfAppliedJobs(username) || 0,
          getUserChatSearchCount(username) || 0,
          countUserSearches(username) || 0,
          getViewedJobCount(username) || 0,
        ]);

        const newChartData = [
          { label: 'Saved Jobs', value: savedJobsCount, color: COLORS.blue },
          { label: 'Applied Jobs', value: appliedJobsCount, color: COLORS.green },
          { label: 'Chat Activity', value: chatCount, color: COLORS.red },
          { label: 'Job Previewing', value: viewedJobCount, color: COLORS.yellow },
          { label: 'Jobs Searched', value: searchCount, color: COLORS.purple },
        ];

        setChartData(newChartData);
      } catch (error) {
        console.error('Error fetching analytics data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const hasActivity = chartData.some((item) => item.value > 0);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!hasActivity) {
    return (
      <View style={styles.centered}>
          <Image source={images.analysis} style={styles.analysis_image} />
        <Text style={styles.noActivityText}>No activity yet</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Donut Chart */}
        <View style={styles.chartContainer}>
          <DonutChart radius={140} strokeWidth={70} data={chartData} />
        </View>

        {/* Chart Labels */}
        <View style={styles.labelsContainer}>
          <FlatList
            data={chartData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.labelRow}>
                <View
                  style={[styles.labelColor, { backgroundColor: item.color }]}
                />
                <Text style={styles.labelText}>
                  {` ${item.value} ${item.label}`}
                </Text>
              </View>
            )}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: height / 9,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  labelsContainer: {
    marginTop: -5,
  },
  labelRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 2,
    backgroundColor: COLORS.white,
    padding: 20,
    width: '50%',
    height: 60,
    borderRadius: 10,
    gap: 5,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 5,
  },
  labelColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  labelText: {
    ...FONTS.body4,
    color: COLORS.black,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  noActivityText: {
    ...FONTS.body2,
    color: COLORS.gray,
  },
  loadingText: {
    ...FONTS.body2,
    color: COLORS.primary,
  },
  analysis_image:{
    width:300,
    height:300,
  }
});

export default AnalysisTab;
