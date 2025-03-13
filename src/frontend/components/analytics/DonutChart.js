import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

const { width, height } = Dimensions.get('window'); // or 'screen'

const DonutChart = ({ radius = 100, strokeWidth = 20, data = [] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const innerRadius = radius - strokeWidth; // Set the inner radius to create the hollow effect
  let cumulativeValue = 0; // Tracks where the next segment should start

  // Function to calculate the start and end points of each segment
  const getArc = (startAngle, endAngle) => {
    const startX = radius + radius * Math.cos(startAngle);
    const startY = radius + radius * Math.sin(startAngle);
    const endX = radius + radius * Math.cos(endAngle);
    const endY = radius + radius * Math.sin(endAngle);

    const innerStartX = radius + innerRadius * Math.cos(startAngle);
    const innerStartY = radius + innerRadius * Math.sin(startAngle);
    const innerEndX = radius + innerRadius * Math.cos(endAngle);
    const innerEndY = radius + innerRadius * Math.sin(endAngle);

    // Create the arc path for the donut chart with rounded edges
    return `
      M ${startX} ${startY}
      A ${radius} ${radius} 0 0 1 ${endX} ${endY}
      L ${innerEndX} ${innerEndY}
      A ${innerRadius} ${innerRadius} 0 0 0 ${innerStartX} ${innerStartY}
      Z
    `;
  };

  // Function to calculate the position of the percentage text
  const getTextPosition = (startAngle, endAngle) => {
    const middleAngle = (startAngle + endAngle) / 2; // The middle point of the slice
    const x = radius + (radius - strokeWidth / 2) * Math.cos(middleAngle); // X position of the text
    const y = radius + (radius - strokeWidth / 2) * Math.sin(middleAngle); // Y position of the text
    return { x, y };
  };

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        {/* Render each segment of the donut chart */}
        {data.map((item, index) => {
          const percentage = item.value / total;
          const startAngle = cumulativeValue * 2 * Math.PI; // Start angle of the segment
          const endAngle = (cumulativeValue + percentage) * 2 * Math.PI; // End angle of the segment

          const path = getArc(startAngle, endAngle); // Get path for the segment

          // Get the text position for the percentage inside the donut slice
          const { x, y } = getTextPosition(startAngle, endAngle);

          cumulativeValue += percentage; // Update cumulative value for the next segment

          return (
            <React.Fragment key={index}>
              {/* Donut slice */}
              <Path
                d={path}
                fill={item.color} // Set the color of each segment
                strokeWidth={0} // Set strokeWidth to 0 since we're filling the segments
              />
              
              {/* Percentage Text inside the slice */}
              <SvgText
                x={x}
                y={y}
                textAnchor="middle"
                fontSize={16}
                fontWeight="bold"
                fill="#fff"
              >
                {`${Math.round(percentage * 100)}%`}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Optional: Center Text */}
        <SvgText
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize={20}
          fontWeight="bold"
          fill="#000"
        >
         {`${total} Activities`}
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DonutChart;
