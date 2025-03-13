import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { images } from '../../constants';

const Error = () => {
  return (
    <View style={styles.container}>
      <Image
        source={images.error} 
        style={styles.image}
      />
      <Text style={styles.text}>Network Failure</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: 300, 
    height: 300,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default Error;
