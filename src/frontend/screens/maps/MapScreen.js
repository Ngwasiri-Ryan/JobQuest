import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  Image,
  Text,
  Animated,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { icons } from "../../constants";
import MapSearch from "./MapSearch";

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJobs, setShowJobs] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [routeCoordinates, setRouteCoordinates] = useState([]); // Store route coordinates
  const [startLocation, setStartLocation] = useState(null); // Start location for the route
  const [endLocation, setEndLocation] = useState(null); // End location for the route
  const mapRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Handle search results
  useEffect(() => {
    if (searchResults.length > 0) {
      const firstResult = searchResults[0];
      setNotificationText(`Location Found: ${firstResult.title}`);
      setNotificationVisible(true);

      // Zoom to the location
      mapRef.current.animateToRegion({
        latitude: firstResult.latitude,
        longitude: firstResult.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      // Animate notification
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => setNotificationVisible(false));
        }, 2000); // Hide after 2 seconds
      });
    }
  }, [searchResults]);

  // Fetch route between two locations
  const fetchRoute = async (start, end) => {
    const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start.latitude},${start.longitude}&destination=${end.latitude},${end.longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes.length > 0) {
        const points = data.routes[0].overview_polyline.points;
        const coordinates = decodePolyline(points); // Decode polyline to coordinates
        setRouteCoordinates(coordinates);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  // Decode polyline to coordinates
  const decodePolyline = (polyline) => {
    const points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < polyline.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  // Handle marker press to set start/end location
  const handleMarkerPress = (coordinate) => {
    if (!startLocation) {
      // Set start location
      setStartLocation(coordinate);
    } else if (!endLocation) {
      // Set end location and fetch route
      setEndLocation(coordinate);
      fetchRoute(startLocation, coordinate);
    } else {
      // Reset and set new start location
      setStartLocation(coordinate);
      setEndLocation(null);
      setRouteCoordinates([]);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission Denied", "Enable location to see your position on the map.");
        setLoading(false);
        return;
      }
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        Alert.alert("Error", error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#5E63FF" style={styles.loader} />
      ) : (
        <>
          {/* Map Component */}
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
            {/* User's Current Location Marker */}
            {location && (
              <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title="You are here"
                pinColor="blue"
              />
            )}

            {/* Job Markers (Only show when toggled on) */}
            {showJobs && (
              <>
                <Marker
                  coordinate={{ latitude: 37.7749, longitude: -122.4194 }}
                  title="Tech Company Hiring"
                  description="Software Developer Position"
                  onPress={() => handleMarkerPress({ latitude: 37.7749, longitude: -122.4194 })}
                />
                <Marker
                  coordinate={{ latitude: 37.7785, longitude: -122.4056 }}
                  title="Startup Job"
                  description="UX/UI Designer Position"
                  onPress={() => handleMarkerPress({ latitude: 37.7785, longitude: -122.4056 })}
                />
              </>
            )}

            {/* Search Result Markers */}
            {searchResults.map((place, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                title={place.title}
                description={place.address}
                onPress={() => handleMarkerPress({ latitude: place.latitude, longitude: place.longitude })}
              />
            ))}

            {/* Draw Route */}
            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#5E63FF"
                strokeWidth={4}
              />
            )}
          </MapView>

          {/* Search Bar */}
          <MapSearch onSearchResults={setSearchResults} />

          {/* Notification */}
          {notificationVisible && (
            <Animated.View style={[styles.notification, { opacity: fadeAnim }]}>
              <Text style={styles.notificationText}>{notificationText}</Text>
            </Animated.View>
          )}

          {/* Floating Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.fab} onPress={requestLocationPermission}>
              <Image source={icons.navigate} style={[styles.icons, { tintColor: "white" }]} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.fab, styles.toggleFab]} onPress={() => setShowJobs(!showJobs)}>
              <Image source={showJobs ? icons.eyeOff : icons.eye} style={styles.icons} />
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
  buttonsContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  fab: {
    backgroundColor: "#5E63FF",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  toggleFab: {
    backgroundColor: "#FF6B6B",
  },
  icons: {
    height: 24,
    width: 24,
    tintColor: "#777",
  },
  notification: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "#5E63FF",
    padding: 15,
    borderRadius: 10,
  },
  notificationText: {
    color: "white",
    fontSize: 16,
  },
});

export default MapScreen;