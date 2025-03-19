import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput } from "react-native";
import videos from "../../data/video";
import { icons, COLORS } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";

const VideoListScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}>
                  <Image source={icons.back} style={styles.backIcon} />
                </TouchableOpacity>
      <Image source={icons.jobtube} style={styles.icon}/>
        <View style={styles.headerIcons}>
          
        </View>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.text}> Watch job inspired videos powered by Indeed to boost your Career. </Text>
      </View>

      {/* Video List Section */}
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.videoItem}
            onPress={() => navigation.navigate("VideoPlayerScreen", { video: item })}
          >
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.infoContainer}>
              <Image source={{ uri: item.channelAvatar }} style={styles.channelAvatar} />
              <View style={styles.textContainer}>
                <Text style={styles.videoTitle}>{item.title}</Text>
                <Text style={styles.channelName}>{item.channelName}</Text>
                <Text style={styles.videoDescription}>{item.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: "white",
    elevation: 4, // Gives shadow effect on Android
    backgroundColor:'#121212',
    paddingTop:40
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 15,
  },
  textBox:{
   marginHorizontal:20,
   marginVertical:10,
  },
  text:{
    color:'#333',
    fontSize:19,
  },
  videoItem: {
    backgroundColor: "white",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    flexDirection: "column",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  thumbnail: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  channelAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginTop: 5,
  },
  textContainer: {
    flex: 1,
  },
  videoTitle: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    flexWrap: "wrap",
  },
  channelName: {
    color: "#606060",
    fontSize: 14,
    marginBottom: 5,
  },
  videoDescription: {
    color: "#606060",
    fontSize: 13,
    lineHeight: 18,
  },
  icon:{
    height:45,
    width:150,
  },
  backIcon:{
    height:25,
    width:25,
    tintColor:'white'
  }
});

export default VideoListScreen;
