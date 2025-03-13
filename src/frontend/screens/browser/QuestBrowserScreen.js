import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import WebView from 'react-native-webview';
import { COLORS, icons } from '../../constants'; 

const QuestBrowserScreen = ({ route, navigation }) => {
  const { url } = route.params;

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={icons.back} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Quest
          <View style={styles.box}>
            <Text style={styles.boxText}>B</Text>
          </View>
          rowser
        </Text>
      </View>

      {/* WebView Section */}
      <View style={styles.webView}>
        <WebView source={{ uri: url }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: '#1E1E2C', // Dark background color
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    marginRight: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    left:'26%'
  },
  box: {
    backgroundColor: COLORS.primary, // Box background color
    borderRadius: 6, // Rounded corners
    paddingHorizontal: 8, // Horizontal padding inside the box
    marginHorizontal: 4, // Space between the box and surrounding text
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    color: '#fff', // Text color inside the box
    fontWeight: 'bold',
    fontSize: 20,
  },
  webView: {
    flex: 1,
  },
});

export default  QuestBrowserScreen;
