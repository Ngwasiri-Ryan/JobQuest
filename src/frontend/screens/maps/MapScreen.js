import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  TextInput,
  Text,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";

const GOOGLE_MAPS_API_KEY = "AIzaSyBpxYpVUtQlXjQgBCJNDvLkADlgTQ9IbLs";

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission Denied", "Enable location to use the map.");
        setLoading(false);
        return;
      }
    }
    updateUserLocation();
  };

  const updateUserLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => console.error("Error fetching location:", error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
  };

  const searchLocation = async () => {
    if (!searchText.trim()) return;
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchText)}&key=${GOOGLE_MAPS_API_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        setSearchedLocation({
          latitude: lat,
          longitude: lng,
          title: data.results[0].formatted_address,
        });

        mapRef.current.animateToRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        // Fetch route from current location to searched location
        if (location) {
          fetchRoute(location, { latitude: lat, longitude: lng });
        }
      } else {
        Alert.alert("Location Not Found", "Try a different search term.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const fetchRoute = async (start, end) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start.latitude},${start.longitude}&destination=${end.latitude},${end.longitude}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes.length > 0) {
        const route = data.routes[0].legs[0];
        const points = route.steps.map((step) => ({
          latitude: step.start_location.lat,
          longitude: step.start_location.lng,
        }));

        setRouteCoordinates(points);
      } else {
        Alert.alert("Route Not Found", "No route available.");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#5E63FF" style={styles.loader} />
      ) : (
        <>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: location ? location.latitude : 37.7749,
              longitude: location ? location.longitude : -122.4194,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            customMapStyle={darkMode ? darkMapStyle : []}
          >
            {location && (
              <Marker coordinate={location} title="You are here" pinColor="blue" />
            )}

            {searchedLocation && (
              <Marker coordinate={searchedLocation} title={searchedLocation.title} />
            )}

            {routeCoordinates.length > 0 && (
              <Polyline coordinates={routeCoordinates} strokeColor="#5E63FF" strokeWidth={4} />
            )}
          </MapView>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a location..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={searchLocation}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchButton} onPress={searchLocation}>
              <Text style={styles.buttonText}>Go</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchContainer: {
    position: "absolute",
    top: 50,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
    alignItems: "center",
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#F5F5F5",
  },
  searchButton: {
    backgroundColor: "#5E63FF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  darkModeButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#5E63FF",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
  },
});

export default MapScreen;
