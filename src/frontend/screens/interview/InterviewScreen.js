import React, {useState} from 'react';
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
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, icons , images} from '../../constants'; // Ensure this path is correct

const API_KEY = 'AIzaSyBPvI-nkHg8DlJgCVcfI3lQXRZcTTcp7c4';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const InterviewScreen = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [graded, setGraded] = useState(false);
  const [grade, setGrade] = useState(0);
  const [comment, setComment] = useState('');

  const fetchQuestions = async () => {
    setLoading(true);
    setShowQuestions(false);
    try {
      const response = await axios.post(
        GEMINI_API_URL,
        {
          contents: [
            {parts: [{text: `Generate 10 interview questions on ${topic}.`}]},
          ],
        },
        {
          headers: {'Content-Type': 'application/json'},
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

  const handleAnswerChange = (index, answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = answer;
    setAnswers(updatedAnswers);
  };

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
          headers: {'Content-Type': 'application/json'},
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

  const getColorForGrade = grade => {
    if (grade >= 90) {
      return '#31cf71';
    } else if (grade >= 70) {
      return '#FFC107';
    } else {
      return '#DC3545';
    }
  };

  const getRemarksForGrade = grade => {
    if (grade >= 90) {
      return 'Excellent work! Keep it up!';
    } else if (grade >= 70) {
      return "Good job! But there's room for improvement.";
    } else {
      return "Don't worry, you can do better! Review your answers.";
    }
  };

  const calculateXP = (grade) => {
    const maxXP = 1000;
    return Math.round((grade / 100) * maxXP);
  };

  const xp = calculateXP(grade);

  const goBackToDefault = () => {
    setTopic('');
    setQuestions([]);
    setAnswers([]);
    setGraded(false);
    setGrade(0);
    setComment('');
    setShowQuestions(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{paddingVertical: 10, flex: 1}}>
        <Text style={styles.header}>Interview Preparation</Text>

        {!graded ? (
          !showQuestions ? (
            // Initial View
            <View style={styles.initialContainer}>
              <Image source={icons.asisstant} style={styles.icon} />
              <Text style={styles.introText}>
                Get your interview skills tested with AI
              </Text>
              <Text style={styles.Text}>
                Give a topic to test your interview skills along with your
                responses and give you a grading
              </Text>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 5,
                  alignItems: 'center',
                  backgroundColor: COLORS.white,
                  borderRadius: 40,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  marginTop: 10,
                  marginBottom: 20,
                }}>
                <Image source={icons.pen} style={{height: 25, width: 25}} />
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
                disabled={loading} // Disable button when loading
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                    }}>
                    <Text style={styles.buttonText}>Generate Questions</Text>
                    <Image
                      source={icons.generate}
                      style={{height: 20, width: 20}}
                    />
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Powered by Gemini</Text>
              </View>
            </View>
          ) : (
            // ScrollView with Questions and Answers Input
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(20, 174, 92, 0.27)',
                }}>
                <Image source={icons.chatbot} style={styles.chatIcon} />
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.black,
                    fontStyle: 'italic',
                    padding: 20,
                  }}>
                  Let's get this interview started !
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 18,
                  color: COLORS.black,
                  fontStyle: 'italic',
                  padding: 20,
                }}>
                Answer these interview questions according so the bot can grade
                it accordingly
              </Text>
              {loading && (
                <ActivityIndicator
                  size="large"
                  color="#5E63FF"
                  style={styles.loadingIndicator}
                />
              )}

              {questions.length > 0 &&
                questions.map((q, index) => (
                  <View key={index} style={styles.questionContainer}>
                    <Text style={styles.questionText}>{q}</Text>
                    <TextInput
                      style={[styles.answerInput, {height: 100}]}
                      placeholder="Type your answer..."
                      placeholderTextColor="#888"
                      multiline
                      value={answers[index]}
                      onChangeText={text => handleAnswerChange(index, text)}
                    />
                    <Image
                      source={answers[index] ? icons.tick : icons.write}
                      style={styles.questionIcon}
                    />
                  </View>
                ))}

              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={submitAnswers}
                  style={styles.button}
                  disabled={loading}>
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
          // Graded View with Feedback
          <View style={styles.evaluationContainer}>
            <Text
              style={{
                fontSize: 40,
                fontWeight: 'bold',
                textAlign: 'center',
                marginVertical: 10,
                color: '#333',
              }}>
              Interview Complete
            </Text>
            {/* Icon based on the grade */}
            <Image source={images.discussion} style={styles.emojiSize} />

            <View></View>

            {/* Remarks based on grade */}
            <Text style={styles.remarksText}>{getRemarksForGrade(grade)}</Text>

            <View style={{marginTop:20}}>
            <View
              style={{
                borderWidth: 2,
                borderRightColor: COLORS.black,
                width: '100%',
                paddingVertical: 20,
                paddingHorizontal: 20,
                borderRadius: 40,
                alignSelf: 'center',
                marginTop: 20,
                flexDirection: 'row',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: '#333',
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                INTERVIEW SCORE
              </Text>
              <View style={{display:'flex', flexDirection:'row', gap:3, justifyContent:'center', alignItems:'center'}}>
              <Image source={icons.signal} style={[styles.smallIcon, {tintColor:getColorForGrade(grade)}]} />
              <Text
                style={{
                    color: getColorForGrade(grade),
                  fontSize: 22,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  
                }}>
                {grade}%
              </Text>
              </View>
              
            </View>

            <View
              style={{
                borderWidth: 2,
                borderRightColor: COLORS.black,
                width: '100%',
                paddingVertical: 20,
                paddingHorizontal: 20,
                borderRadius: 40,
                alignSelf: 'center',
                marginTop: 20,
                flexDirection: 'row',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                
              <Text
                style={{
                  color: '#333',
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                INTERVIEW XP
              </Text>
              <View style={{display:'flex', flexDirection:'row', gap:3, justifyContent:'center', alignItems:'center'}}>
              <Image source={icons.bolt} style={styles.smallIcon} />
              <Text
                style={{
                  color: '#ffcd29',
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {xp} XP
              </Text>
              </View>
            
            </View>

            </View>

           

            {/* Ok Button */}
            <TouchableOpacity onPress={goBackToDefault} style={styles.okButton}>
              <Text style={styles.okButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    width: 200,
    height: 200,
    marginBottom: 20,
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
    height:'100%'
  },
  scoreText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Arial',
  },
  remarksText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
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
     width:'100%',
     bottom:5,
     position:'absolute'
  },
  okButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
   
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
});

export default InterviewScreen;
