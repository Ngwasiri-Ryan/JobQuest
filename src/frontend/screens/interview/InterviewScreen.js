import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, icons, images } from '../../constants'; // Ensure this path is correct

const API_KEY = 'AIzaSyBPvI-nkHg8DlJgCVcfI3lQXRZcTTcp7c4';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const InterviewScreen = ({ navigation }) => {
  // State Management
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [graded, setGraded] = useState(false);
  const [grade, setGrade] = useState(0);
  const [comment, setComment] = useState('');

  // Fetch Interview Questions
  const fetchQuestions = async () => {
    setLoading(true);
    setShowQuestions(false);
    try {
      const response = await axios.post(
        GEMINI_API_URL,
        {
          contents: [
            { parts: [{ text: `Generate 10 interview questions on ${topic}.` }] },
          ],
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      console.log('API Response:', response.data);

      const generatedText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const uniqueQuestions = [
        ...new Set(generatedText.split('\n').filter(q => q.trim() !== '')),
      ];

      setQuestions(uniqueQuestions);
      setAnswers(new Array(uniqueQuestions.length).fill('')); // Initialize answers array
      setShowQuestions(true);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    setLoading(false);
  };

  // Handle Answer Input Change
  const handleAnswerChange = (index, answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = answer;
    setAnswers(updatedAnswers);
  };

  // Submit Answers for Grading
  const submitAnswers = async () => {
    setLoading(true);
    try {
      const formattedAnswers = Object.keys(answers)
        .map(index => `Q: ${questions[index]}\nA: ${answers[index]}`)
        .join('\n\n');

      const response = await axios.post(
        GEMINI_API_URL,
        {
          contents: [
            {
              parts: [
                {
                  text: `Grade the following answers and provide a score out of 100 along with feedback for each answer:\n\n${formattedAnswers}`,
                },
              ],
            },
          ],
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      console.log('Grading API Response:', response.data);
      const feedback =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No feedback available';

      // Extract grade and comment from feedback
      const scoreMatch = feedback.match(/\b(\d{1,3})\b/); // Finds a number between 1-100
      const grade = scoreMatch ? parseInt(scoreMatch[1], 10) : 'N/A';
      const comment =
        feedback.replace(/Score: (\d+)%/, '').trim() || 'No feedback available';

      setGrade(grade);
      setComment(comment);
      setGraded(true);
    } catch (error) {
      console.error('Error grading answers:', error);
    }
    setLoading(false);
  };

  // Helper Functions
  const getColorForGrade = (grade) => {
    if (grade >= 90) return '#31cf71';
    if (grade >= 70) return '#FFC107';
    return '#DC3545';
  };

  const getRemarksForGrade = (grade) => {
    if (grade >= 90) return 'Excellent work! Keep it up!';
    if (grade >= 70) return "Good job! But there's room for improvement.";
    return "Don't worry, you can do better! Review your answers.";
  };

  const calculateXP = (grade) => {
    const maxXP = 1000;
    return Math.round((grade / 100) * maxXP);
  };

  const xp = calculateXP(grade);

  // Reset to Default State
  const goBackToDefault = () => {
    setTopic('');
    setQuestions([]);
    setAnswers([]);
    setGraded(false);
    setGrade(0);
    setComment('');
    setShowQuestions(false);
  };

  const goBack = () =>{
    setShowQuestions(false);
  }

  // Render Components
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingVertical: 10, flex: 1 }}>
        <Text style={styles.header}>Interview Preparation</Text>

        {!graded ? (
          !showQuestions ? (
            // Initial View
            <View style={styles.initialContainer}>
              <Image source={icons.asisstant} style={styles.chat} />
              <Text style={styles.introText}>
                Get your interview skills tested with AI
              </Text>
              <Text style={styles.Text}>
                Give a topic to test your interview skills along with your
                responses and give you a grading
              </Text>

              <View style={styles.inputContainer}>
                <Image source={icons.pen} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter a topic"
                  placeholderTextColor="#888"
                  value={topic}
                  onChangeText={setTopic}
                />
              </View>

              <TouchableOpacity
                onPress={fetchQuestions}
                style={styles.button}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>Generate Questions</Text>
                    <Image source={icons.generate} style={styles.buttonIcon} />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('InterviewPrepScreen')}
                style={styles.flashCardButton}
              >
                <Text style={styles.flashCardButtonText}>Use flash cards</Text>
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Powered by Gemini</Text>
              </View>
            </View>
          ) : (
            // Questions and Answers View
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.chatHeader}>
                <TouchableOpacity onPress={goBack}>
                  <Image source={icons.back} style={styles.backIcon} />
                </TouchableOpacity>
                <Image source={icons.chatbot} style={styles.chatIcon} />
                <Text style={styles.chatHeaderText}>
                  Let's get this interview started!
                </Text>
              </View>

              <Text style={styles.instructionsText}>
                Answer these interview questions so the bot can grade them accordingly.
              </Text>

              {loading && (
                <ActivityIndicator
                  size="large"
                  color="#5E63FF"
                  style={styles.loadingIndicator}
                />
              )}

              {questions.map((q, index) => (
                <View key={index} style={styles.questionContainer}>
                  <Text style={styles.questionText}>{q}</Text>
                  <TextInput
                    style={styles.answerInput}
                    placeholder="Type your answer..."
                    placeholderTextColor="#888"
                    multiline
                    value={answers[index]}
                    onChangeText={(text) => handleAnswerChange(index, text)}
                  />
                  <Image
                    source={answers[index] ? icons.tick : icons.write}
                    style={styles.questionIcon}
                  />
                </View>
              ))}

              <View style={styles.submitButtonContainer}>
                <TouchableOpacity
                  onPress={submitAnswers}
                  style={styles.button}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.buttonText}>Submit Answers</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          )
        ) : (
          // Graded View
          <View style={styles.evaluationContainer}>
            <Text style={styles.evaluationHeader}>Interview Complete</Text>
            <Image source={images.discussion} style={styles.emojiSize} />

            <Text style={styles.remarksText}>{getRemarksForGrade(grade)}</Text>

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>INTERVIEW SCORE</Text>
              <View style={styles.scoreValueContainer}>
                <Image
                  source={icons.signal}
                  style={[styles.smallIcon, { tintColor: getColorForGrade(grade) }]}
                />
                <Text style={[styles.scoreValue, { color: getColorForGrade(grade) }]}>
                  {grade}%
                </Text>
              </View>
            </View>

            <View style={styles.xpContainer}>
              <Text style={styles.xpLabel}>INTERVIEW XP</Text>
              <View style={styles.xpValueContainer}>
                <Image source={icons.bolt} style={styles.smallIcon} />
                <Text style={styles.xpValue}>{xp} XP</Text>
              </View>
            </View>

            <TouchableOpacity onPress={goBackToDefault} style={styles.okButton}>
              <Text style={styles.okButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
  scrollContainer: {
    paddingBottom: 50,
  },
  header: {
    fontSize: 20,
    color: COLORS.black,
    textAlign: 'center',
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    zIndex: 20,
    width: '100%',
    position: 'relative',
  },
  initialContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chat:{
    height:200,
    width:200,
  },
  introText: {
    fontSize: 19,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  Text: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
    paddingHorizontal: 30,
  },
  backIcon:{
    height:25,
    width:30,
    left:-40
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  inputIcon: {
    height: 25,
    width: 25,
  },
  textInput: {
    width: '80%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#263238',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    width: '80%',
  },
  buttonContent: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    height: 20,
    width: 20,
  },
  flashCardButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#263238',
    borderRadius: 40,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashCardButtonText: {
    color: COLORS.lightGray,
    fontSize: 17,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
  questionContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginHorizontal: 10,
  },
  questionText: {
    fontSize: 17,
    color: '#333',
    marginBottom: 20,
  },
  answerInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#000',
    height: 100,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  evaluationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    width: '100%',
    height: '100%',
  },
  evaluationHeader: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  remarksText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  scoreContainer: {
    borderWidth: 2,
    borderRightColor: COLORS.black,
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 40,
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreLabel: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scoreValueContainer: {
    flexDirection: 'row',
    gap: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  xpContainer: {
    borderWidth: 2,
    borderRightColor: COLORS.black,
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 40,
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpLabel: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  xpValueContainer: {
    flexDirection: 'row',
    gap: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  xpValue: {
    color: '#ffcd29',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  okButton: {
    backgroundColor: '#263238',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#263238',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width: '100%',
    bottom: 5,
    position: 'absolute',
  },
  okButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 174, 92, 0.27)',
  },
  chatHeaderText: {
    fontSize: 16,
    color: COLORS.black,
    fontStyle: 'italic',
    padding: 20,
  },
  instructionsText: {
    fontSize: 18,
    color: COLORS.black,
    fontStyle: 'italic',
    padding: 20,
  },
  questionIcon: {
    height: 20,
    width: 20,
    marginTop: 10,
  },
  chatIcon: {
    height: 40,
    width: 40,
    marginTop: 10,
  },
  emojiSize: {
    height: 300,
    width: 300,
  },
  smallIcon: {
    height: 30,
    width: 30,
  },
  submitButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InterviewScreen;