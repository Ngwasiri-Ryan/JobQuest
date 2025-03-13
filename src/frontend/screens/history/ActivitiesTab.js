import { StyleSheet, Text, View, ScrollView , Dimensions} from "react-native";
import React from "react";
import Graph from "../../components/analytics/Graph";
import { COLORS, FONTS } from "../../constants";
const { width, height } = Dimensions.get('window'); // or 'screen'

const ActivitiesTab = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity Analysis  📈</Text>
        <Text style={styles.description}>
          View and analyze your activity trends over time.
        </Text>
      </View>
      <View style={styles.graphContainer}>
        <Graph />
      </View>
    </ScrollView>
  );
};

export default ActivitiesTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom:10,
  },
  description: {
    ...FONTS.body3,
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom:25,
  },
  graphContainer: {
    backgroundColor: COLORS.white,
    top:-height/200,
  },
});
