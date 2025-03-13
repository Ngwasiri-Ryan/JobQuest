import { Share, Platform, PermissionsAndroid, Alert } from 'react-native';
import RNFS from 'react-native-fs';

export const shareVideo = async (videoUrl) => {
  try {
    await Share.share({
      message: `Check out this video: ${videoUrl}`,
    });
  } catch (error) {
    console.error('Error sharing video:', error);
  }
};

export const downloadVideo = async (videoUrl, videoTitle) => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download videos.',
          buttonPositive: 'OK',
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied!', 'You need to grant storage permission to download videos.');
        return;
      }
    }

    // Define download directory
    const downloadDir = Platform.OS === 'ios' 
      ? RNFS.DocumentDirectoryPath 
      : RNFS.DownloadDirectoryPath;
    
    const filePath = `${downloadDir}/${videoTitle}.mp4`;

    // Start downloading the file
    const options = {
      fromUrl: videoUrl,
      toFile: filePath,
      background: true,
      discretionary: true,
    };

    const downloadResult = await RNFS.downloadFile(options).promise;

    if (downloadResult.statusCode === 200) {
      Alert.alert('Download Complete', `Video saved to: ${filePath}`);
    } else {
      Alert.alert('Download Failed', 'Something went wrong while downloading the video.');
    }
  } catch (error) {
    console.error('Error downloading video:', error);
  }
};
