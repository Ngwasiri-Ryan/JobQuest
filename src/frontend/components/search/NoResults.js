import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { icons, COLORS, images} from '../../constants';


const NoResults = () => {
  return (
    <View style={styles.container}>
      <Image
        source={images.no_result} // Replace with your image path
        style={styles.image}
      />
      <Text style={styles.text}>No Results Found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Adjust the background color to match your app
  },
  image: {
    width: 400,  // Adjust the size of the image
    height: 400,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default NoResults;
