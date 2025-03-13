import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const DotLoader = () => {
  const animations = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animateDots = (index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animations[index], {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(animations[index], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animations.forEach((_, index) => {
      const delay = index * 150; // Delay each dot animation
      setTimeout(() => animateDots(index), delay);
    });
  }, []);

  return (
    <View style={styles.container}>
      {animations.map((animation, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              transform: [
                {
                  translateX: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20], // Adjust movement distance here
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  dot: {
    width: 10,
    height: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#87CEEB', // Adjust to your color
  },
});

export default DotLoader;
