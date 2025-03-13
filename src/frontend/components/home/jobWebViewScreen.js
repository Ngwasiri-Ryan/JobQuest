import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '../../constants';
import { useNavigation } from '@react-navigation/native';

const JobWebViewScreen = ({ route }) => {
  const navigation = useNavigation();
  const { url } = route.params; // URL passed from JobItem
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(false); // Error state

  return (
    <View style={styles.container}>
      {/* Loader */}
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      {/* WebView */}
      {!error ? (
        <WebView
          source={{ uri: url }}
          style={styles.webView}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      ) : (
        // Fallback message if content fails to load
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No content here</Text>
        </View>
      )}

      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1,
  },
  closeButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  webView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: COLORS.gray,
  },
});

export default JobWebViewScreen;
