import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, images } from '../../constants';

const Search = () => {
  return (
    <View style={styles.container}>
      <Image
        source={images.search_job} 
        style={styles.image}
      />
      <Text style={styles.text}>Search a job by location or title</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  image: {
    width: 400, 
    height: 450,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default Search;
