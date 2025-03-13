import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { images } from '../../constants';

const RequestError = () => {
  return (
    <View style={styles.container}>
      <Image
        source={images.error_429} 
        style={styles.image}
      />
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

export default RequestError;
