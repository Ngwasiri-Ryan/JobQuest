import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Text, TouchableOpacity,Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, icons } from '../../../constants';

const CoverLetterStepper = ({ navigation }) => {
  const [step, setStep] = useState(1); // Step tracker

  // State for all form fields
  const [senderName, setSenderName] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverCompany, setReceiverCompany] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [openingParagraph, setOpeningParagraph] = useState('');
  const [bodyParagraph, setBodyParagraph] = useState('');

  // Handle next step
  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle final submission
  const handleSubmit = () => {
    const coverLetterData = {
      senderName,
      senderAddress,
      senderPhone,
      senderEmail,
      receiverName,
      receiverCompany,
      receiverAddress,
      jobTitle,
      openingParagraph,
      bodyParagraph,
    };
    navigation.navigate('CoverLetterPreviewScreen', { coverLetterData });
  };

  // Render step-specific content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
          <View style={styles.center}>
          <View style={styles.numberView}>
                <Text style={styles.numberText}>1</Text>
            </View>
          </View>
            <Text style={styles.stepHeader}>Your Details</Text>
            <View style={styles.inputGroup}>
             <Image source={icons.name} style={styles.icon}/>
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                value={senderName}
                onChangeText={setSenderName}
              />
            </View>
            <View style={styles.inputGroup}>
            <Image source={icons.location} style={styles.icon}/>
              <TextInput
                style={styles.input}
                placeholder="Your Address"
                value={senderAddress}
                onChangeText={setSenderAddress}
              />
            </View>
            <View style={styles.inputGroup}>
            <Image source={icons.phone} style={styles.icon}/>
              <TextInput
                style={styles.input}
                placeholder="Your Phone Number"
                value={senderPhone}
                onChangeText={setSenderPhone}
              />
            </View>
            <View style={styles.inputGroup}>
            <Image source={icons.mail} style={styles.icon}/>
              <TextInput
                style={styles.input}
                placeholder="Your Email"
                value={senderEmail}
                onChangeText={setSenderEmail}
              />
            </View>
          </>
        );
      case 2:
        return (
          <>
             <View style={styles.center}>
          <View style={styles.numberView}>
                <Text style={styles.numberText}>2</Text>
            </View>
          </View>
            <Text style={styles.stepHeader}>Receiver Details</Text>
            <View style={styles.inputGroup}>
            <Image source={icons.profile} style={styles.icon}/>
              <TextInput
                style={styles.input}
                placeholder="Hiring Manager's Name"
                value={receiverName}
                onChangeText={setReceiverName}
              />
            </View>
            <View style={styles.inputGroup}>
            <Image source={icons.institute} style={styles.icon}/>
              <TextInput
                style={styles.input}
                placeholder="Company Name"
                value={receiverCompany}
                onChangeText={setReceiverCompany}
              />
            </View>
            <View style={styles.inputGroup}>
            <Image source={icons.map} style={styles.icon}/>
              <TextInput
                style={styles.input}
                placeholder="Company Address"
                value={receiverAddress}
                onChangeText={setReceiverAddress}
              />
            </View>
          </>
        );
      case 3:
        return (
          <>
             <View style={styles.center}>
          <View style={styles.numberView}>
                <Text style={styles.numberText}>3</Text>
            </View>
          </View>
            <Text style={styles.stepHeader}>Job Details</Text>
            <View style={styles.inputGroup}>
            <Image source={icons.skill} style={styles.icon}/>
              <TextInput
                style={styles.input}
                placeholder="Job Title"
                value={jobTitle}
                onChangeText={setJobTitle}
              />
            </View>
          </>
        );
      case 4:
        return (
          <>
             <View style={styles.center}>
          <View style={styles.numberView}>
                <Text style={styles.numberText}>4</Text>
            </View>
          </View>
            <Text style={styles.stepHeader}>Cover Letter Content</Text>
            <View style={styles.inputGroup}>
            <Image source={icons.pen} style={styles.icon}/>
              <TextInput
                style={styles.input}
                placeholder="Opening Paragraph"
                value={openingParagraph}
                onChangeText={setOpeningParagraph}
                multiline
              />
            </View>
            <View style={styles.inputGroup}>
            <Image source={icons.pen} style={styles.icon}/>
              <TextInput
                style={styles.input}
                placeholder="Body Paragraph"
                value={bodyParagraph}
                onChangeText={setBodyParagraph}
                multiline
              />
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View>
         <View style={styles.header}>
             <TouchableOpacity
               style={styles.backButton}
               onPress={() => {
                 navigation.goBack();
               }}>
               <Image source={icons.back} style={[styles.backIcon]} />
             </TouchableOpacity>
             <Text style={styles.headerText}>Create Cover Letter</Text>
           </View>
 <ScrollView contentContainerStyle={styles.container}>
      {renderStepContent()}
      <View style={styles.buttonContainer}>
        {step > 1 && (
           <TouchableOpacity  style={styles.numberView} onPress={handleNextStep}>
           <Image source={icons.rewind} style={styles.nextIcon}/>
     </TouchableOpacity>
        )}
        {step < 4 ? (
            <TouchableOpacity  style={styles.numberView} onPress={handleNextStep}>
                  <Image source={icons.forward} style={styles.nextIcon}/>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity  onPress={handleSubmit}>
                 <Image source={icons.check} style={{height:50, width:50}}/>
            </TouchableOpacity>
         
        )}
      </View>
    </ScrollView>
    </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    height: 100,
    backgroundColor: COLORS.black,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  backButton: {
    left: '-25%',
    right: 0,
  },
  stepHeader: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.black,
    textAlign:'center',
    marginTop:20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    marginBottom: 30,
    gap:10
  },
  input: {
    flex: 1,
    marginLeft: 10,
    marginTop:15,
    borderBottomWidth: 1,
    borderBottomColor:COLORS.black,
    paddingVertical: 5,
    marginBottom:20,
    fontSize:17,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  icon:{
    tintColor:COLORS.black,
    height:30,
    width:30,
  },
  numberView:{
    height:50,
    width:50,
    backgroundColor:COLORS.black,
    justifyContent:'center',
    borderRadius:50,
    justifyContent:'center',
    alignItems:'center'
  },
  numberText:{
    fontSize:24,
    fontWeight:'900',
    color:'white'
  },
  center:{
    justifyContent:'center',
    alignItems:'center'
  },
  nextIcon:{
    tintColor:'white',
    height:20,
    width:20,
  },
  submit:{
    backgroundColor:COLORS.teal,
    justifyContent:'center',
    alignItems:'center',
    width:100,
    borderRadius:50,
  }
});

export default CoverLetterStepper;