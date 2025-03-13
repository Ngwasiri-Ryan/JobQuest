import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Alert, Animated } from 'react-native';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import { COLORS, icons } from '../../constants';
import Share from 'react-native-share';

const ResumePDFScreen = ({ route , navigation }) => {
  const { filePath } = route.params; // Assuming filePath points to the newly created PDF file
  const [isLoading, setIsLoading] = useState(true);

  // Animated value for the heartbeat effect
  const scale = new Animated.Value(1);

  // Start the heartbeat animation
  useEffect(() => {
    const heartbeatAnimation = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1, // Scale up
          duration: 100, // Faster scaling duration
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1, // Scale back to original size
          duration: 100, // Faster scaling back
          useNativeDriver: true,
        }),
      ]).start(() => heartbeatAnimation()); // Restart the animation when it finishes
    };

    heartbeatAnimation(); // Initiate the heartbeat effect
  }, [scale]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const sharePDF = async () => {
    try {
      const pdfPath = filePath.startsWith('file://') ? filePath : `file://${filePath}`;

      // Check if the file exists before sharing
      const fileExists = await RNFS.exists(pdfPath);
      if (!fileExists) {
        Alert.alert('Error', 'PDF file not found');
        return;
      }

      // Configure share options
      const options = {
        title: 'Share PDF',
        url: pdfPath,  // Path to the PDF file
        type: 'application/pdf',  // Specify the MIME type for PDF files
        message: 'Here’s my resume in PDF format.',
      };

      // Use react-native-share to open the share dialog with the file
      await Share.open(options);
    } catch (error) {
      Alert.alert('Error', 'Failed to share the PDF');
      console.error('Share error:', error);
    }
  };

  const downloadPDF = async () => {
    try {
      const pdfPath = filePath.startsWith('file://') ? filePath : `file://${filePath}`;

      // Check if the file exists
      const fileExists = await RNFS.exists(pdfPath);
      if (!fileExists) {
        Alert.alert('Error', 'PDF file not found');
        return;
      }

      // Get the download folder path (Android and iOS specific)
      const downloadDir = RNFS.DownloadDirectoryPath;  // Android Download directory
      // For iOS, you can use `RNFS.DocumentDirectoryPath` for saving files in the app's document directory

      // Create a destination path in the download directory
      const destinationPath = `${downloadDir}/resume.pdf`;

      // Copy the file to the download folder
      await RNFS.copyFile(pdfPath, destinationPath);

      Alert.alert('Success', 'PDF downloaded to the Downloads folder');
      navigation.navigate('JobSelectionScreen')
    } catch (error) {
      Alert.alert('Error', 'Failed to download the PDF');
      console.error('Download error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size={50} color={COLORS.primary} />
      ) : (
        <Pdf
          source={{ uri: filePath, cache: true }}
          onLoadComplete={(numberOfPages) => console.log(`PDF loaded with ${numberOfPages} pages`)}
          onError={(error) => console.error('PDF Load Error:', error)}
          style={styles.pdf}
        />
      )}
      <TouchableOpacity style={styles.shareButton} onPress={sharePDF}>
        <Image source={icons.share} style={styles.icon} />
      </TouchableOpacity>

      {/* Animated download button */}
      <Animated.View style={[styles.download, { transform: [{ scale }] }]}>
        <TouchableOpacity onPress={downloadPDF}>
          <Image source={icons.download} style={styles.icon} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  pdf: { flex: 1, width: '100%', height: '100%' },
  shareButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  download: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  icon: { height: 30, width: 30, tintColor: COLORS.white },
});

export default ResumePDFScreen;
