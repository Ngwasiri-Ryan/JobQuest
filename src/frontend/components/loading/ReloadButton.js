import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing, ActivityIndicator } from 'react-native';
import { COLORS,icons,images } from '../../constants';

const ReloadButton = ({ onReload }) => {
  const [loading, setLoading] = useState(false);
  const rotateValue = new Animated.Value(0);

  // Start the rotation animation
  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const handleReload = async () => {
    setLoading(true);
    startRotation();
    try {
      await onReload(); // Reload callback passed from parent component
    } catch (error) {
      console.error('Error reloading:', error);
    } finally {
      setLoading(false);
      rotateValue.stopAnimation();
    }
  };

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, loading && styles.loadingButton]}
        onPress={handleReload}
        disabled={loading}
      >
        {loading ? (
          <Animated.Image
            source={icons.reload}
            style={[styles.icon, { transform: [{ rotate: rotation }] }]}
          />
        ) : (
          <Animated.Image source={icons.reload} style={styles.icon} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  loadingButton: {
    backgroundColor: COLORS.lightGray,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: COLORS.white,
  },
});

export default ReloadButton;
