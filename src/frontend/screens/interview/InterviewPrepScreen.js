import React, { useState } from "react";
import { View, Text, Animated, StyleSheet, TouchableOpacity, Image } from "react-native";
import { icons , COLORS } from "../../constants";
import questions from "./questions";

const InterviewPrepScreen = ({ navigation }) => {  // Add navigation prop if you're using react-navigation
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [animatedValue] = useState(new Animated.Value(0));
  const [flipped, setFlipped] = useState(false);

  const currentCard = questions[currentCardIndex];

  const flipCard = () => {
    Animated.spring(animatedValue, {
      toValue: flipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const goToNextCard = () => {
    setFlipped(false);
    animatedValue.setValue(0);
    setCurrentCardIndex((prevIndex) =>
      prevIndex === questions.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function for back button
  const goBack = () => {
    navigation.goBack(); // This assumes you're using react-navigation
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Image source={icons.back} style={styles.iconBack} />
      </TouchableOpacity>
      <View style={{width:'100%', alignItems:'center', justifyContent:'center'}}>
      <Text style={{textAlign:'center', color:COLORS.white, fontSize:25}}>Interview Flash Cards</Text>
      </View>
     
      </View>
      

      <Text style={styles.title}>Ace Your Interview</Text>
      <Text style={styles.subtitle}>Practice commonly asked interview questions</Text>

      {/* Show Progress */}
      <Text style={styles.progress}>
        {currentCardIndex + 1}/{questions.length}
      </Text>

      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: currentCard.color },
            {
              transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
            },
          ]}
        >
          <Image source={currentCard.icon} style={styles.icon} />
          <Text style={styles.cardText}>{currentCard.question}</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            { backgroundColor: currentCard.color },
            {
              transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
            },
          ]}
        >
          <Text style={styles.cardText}>{currentCard.answer}</Text>
        </Animated.View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={flipCard}>
          <Text style={styles.controlButtonText}>
            {flipped ? "Show Question" : "Show Answer"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, styles.nextButton]}
          onPress={goToNextCard}
        >
          <Image source={icons.right} style={styles.iconNext} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f7f7",
  },
  header: {
    width:'100%',
       flexDirection: 'row',
       top:0,
       left:0,
       alignItems: 'center',
       position:'absolute',
       display:'flex',
       paddingTop:40,
       marginBottom: 5,
       backgroundColor: COLORS.black, // Make sure the background is set
       padding: 20, // Add some padding for better touch targets
       ...Platform.select({
         ios: {
           shadowColor: '#000', // Color of the shadow
           shadowOffset: { width: 0, height: 2 }, // Position of the shadow
           shadowOpacity: 0.2, // Opacity of the shadow
           shadowRadius: 4, // Blur radius of the shadow
         },
         android: {
           elevation: 5, // Shadow elevation for Android
         },
       }),
 },
  backButton: {
    top: 40,
    left: 20,
    zIndex: 10,
    tintColor:COLORS.white
    // Ensure it stays on top of other components
  },
  iconBack: {
    width: 25,
    height: 25,
    tintColor: COLORS.white,
    top:-40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  progress: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  cardContainer: {
    width: 320,
    height: 420,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backfaceVisibility: "hidden",
    shadowColor: "#AAAAAA",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
    backgroundColor: "#fff", // Ensure the backface is styled well
    padding: 20,  // Add padding for better content spacing
  },
  cardBack: {
    backgroundColor: "#EFEFEF",
  },
  cardText: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    width: "100%",
  },
  controlButton: {
    backgroundColor: COLORS.green,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
  },
  controlButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 10,
  },
  nextButton: {
    backgroundColor: COLORS.black,
    borderRadius: 50,  // Makes it round
    padding: 15,  // Adjusted for better spacing
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
  },
  iconNext: {
    width: 25,
    height: 25,
    tintColor: "#fff",
  },
});

export default InterviewPrepScreen;
