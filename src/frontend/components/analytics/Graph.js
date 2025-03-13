import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity , Dimensions} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { COLORS } from "../../constants";
import { useUserContext } from "../../hooks/UserContext";
import { fetchUserEventData } from "../../../backend/analysis/data";
import DotLoader from "../loading/DotLoader";
import { LineChart } from "react-native-gifted-charts";

const { width, height } = Dimensions.get('window'); // or 'screen'

const Graph = () => {
  const { width, height } = Dimensions.get('window'); // or 'screen'
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltipData, setTooltipData] = useState(null); // Store tooltip data
  const { userData } = useUserContext();
  const username = userData?.username;

  // Function to update chart data with event data from Firestore
  const updateChartData = async () => {
    if (!username) {
      console.log("Username is not available.");
      return;
    }

    setLoading(true); // Set loading before fetching data
    const result = await fetchUserEventData(username);

    if (result.success) {
      setChartData(result.data); // Update state with fetched event data
    } else {
      console.error("Failed to fetch data:", result.error);
    }

    setLoading(false); // Stop loading once data is set
  };

  useEffect(() => {
    updateChartData(); // Fetch data when component mounts
  }, [username]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
       <DotLoader/>
      </View>
    );
  }

  const handleDataPointClick = (point) => {
    setTooltipData({
      x: point.x,
      y: point.y,
      valueX: point.valueX,
      valueY: point.valueY,
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFFFFF", "#0181541A"]}
        style={styles.gradientBackground}
      >
        <LineChart
          data={chartData}
          width={340} // Chart width
          height={height/3.8} // Chart height
          isAnimated
          adjustToWidth
          initialSpacing={30} // Adjusted initial spacing to create more space before the first point
          spacing={50} // Increased spacing between data points on the X-axis
          color='#018154'// Line color
          thickness={3}
          startFillColor="'#018154" // Start of the gradient for the bounded area
          endFillColor="#CDE6FF" // End of the gradient for the bounded area
          startOpacity={0.5} // Opacity at the start of the bounded area
          endOpacity={0.1} // Opacity at the end of the bounded area
          yAxisColor="#d3d3d3" // Y-axis color
          yAxisThickness={1}
          xAxisColor="#d3d3d3" // X-axis color
          xAxisThickness={1}
          yAxisTextStyle={{display:'none' }} // Hide Y-axis labels
          xAxisTextStyle={{ fontSize: 0 }}
          noOfSections={6} // Number of sections on the Y-axis
          rulesColor="transparent" // Remove gridlines
          rulesThickness={0}
          showVerticalLines={false} // Disable vertical lines
          showScrollIndicator={false}
          showDataPointOnFocus={true}
          onDataPointClick={handleDataPointClick} // Set tooltip data on click
        />
        {tooltipData && (
          <View
            style={[styles.tooltipContainer, { left: tooltipData.x - 20, top: tooltipData.y - 30 }]}
          >
            <Text style={styles.tooltipText}>
              {`X: ${tooltipData.valueX}\nY: ${tooltipData.valueY}`}
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    width: 400, // Match chart width
    height: 280, // Match chart height
    borderRadius: 10, // Optional for rounded corners
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipContainer: {
    position: "absolute",
    backgroundColor: "#ffffff",
    borderRadius: 5,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  tooltipText: {
    fontSize: 12,
    color: COLORS.black,
  },
});

export default Graph;
