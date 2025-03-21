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
  Modal,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import axios from "axios";
import { COLORS } from "../../constants";

const GOOGLE_MAPS_API_KEY = "AIzaSyBpxYpVUtQlXjQgBCJNDvLkADlgTQ9IbLs";
const ADZUNA_APP_ID = "f6033e84";
const ADZUNA_APP_KEY = "a94e6316621ed540f5006c78c7ba76e0";

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [endCoordinates, setEndCoordinates] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [jobLocations, setJobLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [commuteDetails, setCommuteDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    requestLocationPermission();
    fetchJobs();
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

  const fetchJobs = async () => {
    const COUNTRIES = ["at", "au", "be", "br", "ca", "ch", "de", "es", "fr", "gb", "in", "it", "mx", "nl", "nz", "pl", "sg", "us", "za"];
    let allJobs = [];

    for (let country of COUNTRIES) {
      try {
        const response = await axios.get(
          `https://api.adzuna.com/v1/api/jobs/${country}/search/1`,
          {
            params: {
              app_id: ADZUNA_APP_ID,
              app_key: ADZUNA_APP_KEY,
              results_per_page: 20,
            },
          }
        );
        allJobs.push(...response.data.results);
      } catch (error) {
        console.error(`Error fetching jobs for ${country}:`, error.message);
      }
    }

    const validJobs = allJobs.filter((job) => job.latitude && job.longitude);
    setJobLocations(validJobs);
  };

  const geocodeAddress = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        Alert.alert("Location Not Found", "Try a different address.");
        return null;
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  };

  const fetchRoute = async (start, end) => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start.latitude},${start.longitude}&destination=${end.latitude},${end.longitude}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes.length > 0) {
        const points = data.routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(points);
        setRouteCoordinates(decodedPoints);

        // Extract distance and duration
        const distance = data.routes[0].legs[0].distance.text;
        const duration = data.routes[0].legs[0].duration.text;
        setCommuteDetails({ distance, duration });
      } else {
        Alert.alert("Route Not Found", "No route available.");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const decodePolyline = (encoded) => {
    const points = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  const handleRoute = async () => {
    if (!startLocation || !endLocation) {
      Alert.alert("Error", "Please enter both start and end locations.");
      return;
    }

    const start = await geocodeAddress(startLocation);
    const end = await geocodeAddress(endLocation);

    if (start && end) {
      setStartCoordinates(start);
      setEndCoordinates(end);
      fetchRoute(start, end);

      mapRef.current.fitToCoordinates([start, end], {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const coordinates = await geocodeAddress(searchQuery);
    if (coordinates) {
      setSearchedLocation(coordinates);
      mapRef.current.animateToRegion({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const zoomToCurrentLocation = () => {
    if (location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const handleJobMarkerPress = async (job) => {
    setSelectedJob(job);
    if (location) {
      await fetchRoute(location, {
        latitude: job.latitude,
        longitude: job.longitude,
      });
      setModalVisible(true);
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
          >
            {/* Display job locations as green markers */}
            {jobLocations.map((job, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: job.latitude,
                  longitude: job.longitude,
                }}
                title={job.company.display_name}
                description={job.title}
                pinColor="green"
                onPress={() => handleJobMarkerPress(job)}
              />
            ))}

            {/* Red marker for user's current location */}
            {location && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Your Location"
                pinColor="red"
              />
            )}

            {startCoordinates && (
              <Marker coordinate={startCoordinates} title="Start Location" />
            )}
            {endCoordinates && (
              <Marker coordinate={endCoordinates} title="End Location" />
            )}
            {searchedLocation && (
              <Marker coordinate={searchedLocation} title="Searched Location" />
            )}
            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#5E63FF"
                strokeWidth={4}
              />
            )}
          </MapView>

          {/* Search and Route Container */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a location..."
              placeholderTextColor={COLORS.black}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.currentLocationButton}
              onPress={zoomToCurrentLocation}
            >
              <Text style={styles.buttonText}>My Location</Text>
            </TouchableOpacity>
          </View>

          {/* Start and End Location Inputs */}
          <View style={styles.routeContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter start location..."
                placeholderTextColor={COLORS.black}
              value={startLocation}
              onChangeText={setStartLocation}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Enter end location..."
              placeholderTextColor={COLORS.black}
              value={endLocation}
              onChangeText={setEndLocation}
            />
            <TouchableOpacity style={styles.routeButton} onPress={handleRoute}>
              <Text style={styles.buttonText}>Route</Text>
            </TouchableOpacity>
          </View>

          {/* Job Details Modal */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {selectedJob?.company.display_name}
                </Text>
                <Text style={styles.modalSubtitle}>{selectedJob?.title}</Text>
                {commuteDetails && (
                  <>
                    <Text style={styles.modalText}>
                      Distance: {commuteDetails.distance}
                    </Text>
                    <Text style={styles.modalText}>
                      Duration: {commuteDetails.duration}
                    </Text>
                  </>
                )}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    placeholder:COLORS.black,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#5E63FF",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  currentLocationButton: {
    backgroundColor: "#5E63FF",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  routeContainer: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
    elevation: 5,
  },
  routeButton: {
    backgroundColor: "#5E63FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#5E63FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default MapScreen;