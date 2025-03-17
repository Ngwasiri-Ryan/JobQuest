import React, { useState } from "react";
import { View, TextInput, StyleSheet, ActivityIndicator, Image } from "react-native";
import axios from "axios";
import { icons } from "../../constants";

const MapSearch = ({ onSearchResults }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const searchLocation = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const options = {
      method: "GET",
      url: "https://google-search-master-mega.p.rapidapi.com/maps",
      params: { 
        q: query, 
        hl: "en", 
        page: "1" },
      headers: {
        "x-rapidapi-key": "7fd213d47emshb49cf8bd294a249p1de61ajsn820c90d640ca",
        "x-rapidapi-host": "google-search-master-mega.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      const places = response.data.places.map((place) => ({
        title: place.title,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
      }));
      onSearchResults(places);
    } catch (error) {
      console.error("Search Error:", error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.searchContainer}>
      <Image source={icons.search} style={styles.icons} />
      <TextInput
        placeholder="Search for locations..."
         placeholderTextColor="black"
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchLocation}
      />
      {loading && <ActivityIndicator size="small" color="#5E63FF" />}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  icons: {
    height: 24,
    width: 24,
    tintColor: "#777",
  },
});

export default MapSearch;
