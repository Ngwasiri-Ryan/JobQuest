import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Platform ,Alert, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, icons, FONTS } from '../../constants';
import DotLoader from '../../components/loading/DotLoader';
import { useUserContext } from '../../hooks/UserContext';
import { saveChatHistory } from '../../../backend/history/chatHistory';


import axios from 'axios';
import { API_KEY } from '@env';

const { width, height } = Dimensions.get('window');


const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { userData } = useUserContext();
  const username = userData?.username;
  const [quickReplies, setQuickReplies] = useState([
    "What's the latest job update?",
    "How can I apply for a job?",
  ]);

  // Load chat history from local storage
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem('chatHistory');
        if (savedMessages) setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };
    loadMessages();
  }, []);

  // Save chat history to local storage
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem('chatHistory', JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save chat history:', error);
      }
    };
    saveMessages();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const timestamp = new Date().toLocaleTimeString();
    const userMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    //save chat history
    saveChatHistory(username, input); 

    try {
      const options = {
        method: 'POST',
        url: 'https://chatgpt-vision1.p.rapidapi.com/gpt4',
        headers: {
          'x-rapidapi-key': '7fd213d47emshb49cf8bd294a249p1de61ajsn820c90d640ca',
          'x-rapidapi-host': 'chatgpt-vision1.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
        data: { messages: [{ role: 'user', content: input }], web_access: false },
      };

      const response = await axios.request(options);
      const botContent = response.data?.result || 'Sorry, I didn’t catch that.';
      const botMessage = {
        id: Date.now().toString() + '-bot',
        role: 'bot',
        content: botContent,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = {
        id: Date.now().toString() + '-error',
        role: 'bot',
        content: 'Something went wrong. Please try again later.',
        retry: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const retryMessage = async (failedMessage) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== failedMessage.id));
    setInput(failedMessage.content);
    sendMessage();
  };

  const sendQuickReply = (query) => {
    setInput(query);
    sendMessage();
  };

  const clearChat = () => {
    Alert.alert('Clear Chat', 'Are you sure you want to clear the chat?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          setMessages([]);
          await AsyncStorage.removeItem('chatHistory');
        },
      },
    ]);
  };

  const renderMessage = ({ item }) => (
    <View>
      <View
        style={[
          styles.messageWrapper,
          item.role === 'user' ? styles.userWrapper : styles.botWrapper,
        ]}
      >
        {item.role === 'bot' && <Image source={icons.chatbot} style={styles.botImage} />}
        {item.role === 'user' && <Image source={icons.userIcon} style={styles.userImage} />}
        <View
          style={[
            styles.messageContainer,
            item.role === 'user' ? styles.userMessage : styles.botMessage,
          ]}
        >
          <Text style={styles.messageText}>{item.content}</Text>
        </View>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
      {item.retry && (
        <TouchableOpacity onPress={() => retryMessage(item)} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{display:'flex', flexDirection:'row', gap:2,justifyContent:'center', alignItems:'center', paddingLeft:'35%'}}>
        <Text style={styles.heading}>Questbot</Text>
        <Image source={icons.chatbot} style={styles.botImage} />
        </View>
       
        <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
        <Image source={icons.broom} style={styles.botImage} />
        </TouchableOpacity>
      </View>
      <View style={{ marginHorizontal: 10, flex: 1 }}>
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Image source={icons.chatbot} style={styles.bot} />
            <Text style={styles.text}>Start chatting with JobQuest Chatbot</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.chatContainer}
          />
        )}
        {loading && (
          <View style={styles.typingIndicator}>
            <DotLoader />
            <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
              <Image source={icons.robot} style={styles.botIcon} />
              <Text style={styles.typingText}>Bot is typing...</Text>
            </View>
          </View>
        )}
        <View style={styles.quickReplies}>
          {quickReplies.map((reply, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => sendQuickReply(reply)}
              style={styles.quickReplyButton}
            >
              <Text style={styles.quickReplyText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={input}
            onChangeText={setInput}
            placeholderTextColor={COLORS.black}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Image source={icons.share} style={styles.icons} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    paddingBottom: 80,
  },
  clearButton: {
    left:60,
  },
  
  header: {
    width:'100%',
    flexDirection: 'row',
    alignItems: 'center',
    display:'flex',
    marginBottom: 5,
    backgroundColor: COLORS.white, // Make sure the background is set
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
  heading: {
    color: COLORS.black,
    ...FONTS.h3,
  },
  chatContainer: {
    flex: 1,
    marginBottom:50,
  },
  text:{
   color:COLORS.black,
   ...FONTS.body2,
   marginBottom:10,
  },
  chatContent: {
    padding: 10,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  quickReplyText:{
    color:COLORS.darkgray,
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  botWrapper: {
    justifyContent: 'flex-start',
  },
  quickReplies: {
    display: 'flex',
    flexWrap: 'wrap', // Allows wrapping to form multiple rows
    flexDirection: 'row',
    gap: 5, // Adds space between items
    overflow: 'hidden', // Hides items beyond two rows if needed
  },
  timestamp: {
    fontSize: width*0.03,
    color: COLORS.black,
    marginTop: 5,
    bottom: 5, // Adjust the vertical position
  },
  
  quickReplyButton:{
    padding:10,
    backgroundColor:COLORS.lightGray,
    width:'60%',
    borderRadius:50,
    marginBottom:10,
  },
  bot:{
    height:100,
    width:100,
    marginBottom:20,
    },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#87CEEB',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderColor: '#DDD',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    color:COLORS.black
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#DDD',
    placeholderTextColor:COLORS.darkgray,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
    fontSize: 16,
    color:COLORS.black,
  },
  sendButton: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 50,
    justifyContent:'center',
    alignContent:'center'
  },
  botImage: {
    height: 40,
    width: 40,
    marginRight: 10,
  },
  userImage: {
    height: 30,
    width: 30,
    marginRight: 10,
    top:5,
  },
  loaderContainer: {
    alignItems: 'center',
    marginVertical: 5,
    marginLeft: 20,
  },
  icons: {
    height: 25,
    width: 25,
    tintColor: COLORS.white,
  },
  botIcon: {
    height: 20,
    width: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    width:'70%'
  },
});
