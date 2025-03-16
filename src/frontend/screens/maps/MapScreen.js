import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

const MapScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT} // Uses OpenStreetMap instead of Google Maps
        style={styles.map}
        initialRegion={{
          latitude: 37.7749, // Default location (San Francisco)
          longitude: -122.4194,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        tileSize={256}
        urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      >
        <Marker
          coordinate={{ latitude: 37.7749, longitude: -122.4194 }}
          title="Software Engineer Job"
          description="Tech Company Hiring"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
});

export default MapScreen;
