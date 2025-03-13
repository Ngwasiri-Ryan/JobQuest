import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import { icons } from '../../constants';
import { shareVideo, downloadVideo } from '../../utils/videoActions';
const { width, height } = Dimensions.get('window');

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const VideoPlayerScreen = ({ route, navigation }) => {
  const { video } = route.params;
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  const handleProgress = (progress) => {
    setCurrentTime(progress.currentTime);
  };

  const handleSeek = (time) => {
    videoRef.current.seek(time);
    setCurrentTime(time);
  };

  const handleReplay = () => {
    videoRef.current.seek(0); 
    setPaused(false); 
  };
  

  const handleSkip = (seconds) => {
    const newTime = Math.min(Math.max(currentTime + seconds, 0), duration);
    handleSeek(newTime);
  };

  return (
    <View style={styles.playerContainer}>
      <StatusBar hidden />

      <Video
        ref={videoRef}
        source={video.source}
        style={styles.videoPlayer}
        paused={paused}
        onProgress={handleProgress}
        onLoad={(meta) => setDuration(meta.duration)}
      />

      <View style={styles.videoControls}>
        <TouchableOpacity onPress={() => handleSkip(-10)} style={styles.controlButton}>
          <Image source={icons.rewind} style={styles.controlIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPaused(!paused)} style={styles.controlButton}>
          <Image source={paused ? icons.play : icons.pause} style={styles.controlIcon} />
        </TouchableOpacity>


        <TouchableOpacity onPress={() => handleSkip(10)} style={styles.controlButton}>
          <Image source={icons.forward} style={styles.controlIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.customControls}>
        <View style={styles.timer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Slider
            style={styles.seekBar}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            onValueChange={handleSeek}
            minimumTrackTintColor="#5E63FF"
            maximumTrackTintColor="#fff"
            thumbTintColor="#5E63FF"
          />
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity>
          <Image source={icons.like} style={styles.controlIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => shareVideo(video.link)}>
          <Image source={icons.share} style={styles.controlIcon} />
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => downloadVideo(video.link, video.title)}>
          <Image source={icons.download} style={styles.controlIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReplay}>
          <Image source={icons.replay} style={styles.controlIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.detailsContainer}>
        <Text style={styles.videoTitle}>{video.title}</Text>
        <Text style={styles.videoInfo}>{video.description}</Text>

        <View style={styles.channelContainer}>
          <Image source={{ uri: video.channelAvatar }} style={styles.channelImage} />
          <Text style={styles.channelName}>{video.channelName}</Text>
          <View></View>
        </View>

        <View style={styles.descriptionTextContainer}>
          <Text style={styles.videoInfo}>To get more resources for this get to the Indeed website following the link below this description</Text>
        </View>

        <TouchableOpacity style={styles.resourceContainer}
          onPress={() => navigation.navigate('QuestBrowserScreen', { url: video.link })}
        >
          <Image source={icons.link} style={styles.controlIcon} />
          <Text style={styles.channelName}>{video.title}</Text>
          <View></View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: { flex: 1, backgroundColor: 'black' },
  videoPlayer: { width: width, height: 250 },
  videoControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 80,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  controlButton: { padding: 10 },
  controlIcon: { width: 20, height: 20, tintColor: 'white' },
  customControls: { alignItems: 'center', marginVertical: 10 },
  timer: { flexDirection: 'row', justifyContent: 'space-between', width: '90%' },
  timeText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  seekBar: { flex: 1, marginHorizontal: 10 },
  controlsContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 15 },
  resourceContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#898989', marginTop: 50, borderRadius: 40 },
  detailsContainer: { padding: 15 },
  videoTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  videoInfo: { fontSize: 14, marginTop: 5, color: 'white' },
  channelContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  channelImage: { width: 40, height: 40, borderRadius: 20 },
  channelName: { marginLeft: 10, fontSize: 16, fontWeight: 'bold', color: 'white' },
  subscribeButton: { marginLeft: 'auto', backgroundColor: 'red', padding: 8, borderRadius: 5 },
  subscribeText: { color: 'white', fontWeight: 'bold' },
  descriptionTextContainer: { top: 20 }
});

export default VideoPlayerScreen;
