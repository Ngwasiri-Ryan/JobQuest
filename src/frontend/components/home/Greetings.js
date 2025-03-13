import React from 'react';
import { COLORS } from '../../constants';
import { StyleSheet, View,Text } from 'react-native';
import { useUserContext } from '../../hooks/UserContext';

const Greetings = () => {

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return { greeting: "Good morning", icon: "☀️" }; 
    } else if (hours < 18) {
      return { greeting: "Good afternoon", icon: "🌤️" }; 
    } else {
      return { greeting: "Good evening", icon: "🌙" }; 
    }
  };

  const { greeting, icon } = getGreeting();
  
  // Format date to "Thursday 12th June 2025"
  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(',', '');
  };

  const { userData } = useUserContext();
  const username = userData?.username;

  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>
        {icon} {greeting}, {username}
      </Text>
      <Text style={styles.dateText}>
        {formatDate(new Date())}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.black,
    marginTop: 5,
  },
});

export default Greetings;
