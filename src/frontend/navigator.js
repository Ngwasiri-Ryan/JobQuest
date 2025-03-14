import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { UserProvider } from './hooks/UserContext';
import { icons, COLORS } from './constants';
import { Image } from 'react-native';

import HomeScreen from './screens/home/HomeScreen';
import SplashScreen from './screens/starter/SplashScreen';
import WelcomeScreen from './screens/starter/WelcomeScreen';
import LoginScreen from './screens/auth/LoginScreen';
import SignUpScreen from './screens/auth/SignUpScreen';
import JobSelectionScreen from './screens/starter/jobSelectionScreen';
import JobDetailsScreen from './screens/job/JobDetailsScreen';
import FindjobScreen from './screens/search/FindJobScreen';
import NewsScreen from './screens/news/NewsScreen';
import InterviewPrepScreen from './screens/interview/InterviewPrepScreen';
import UserProfileScreen from './screens/profile/UserProfileScreen';
import AnalyticsScreen from './screens/history/AnalyticsScreen';
import ChatScreen from './screens/chat/ChatScreen';
import ProfileScreen from './screens/user/ProfileScreen';
import EditProfileScreen from './screens/user/EditProfileScreen';
import Loader from './components/loading/Loader';

import ResumeMakerScreen from './screens/resume/ResumeMaker';
import ResumePreviewScreen from './screens/resume/ResumePreviewerScreen';
//code breaks from here
//import ResumePDFScreen from './screens/resume/ResumePDFScreen';


import Step1 from './screens/stepper/Step1Screen';
import Step2 from './screens/stepper/Step2Screen';
import Step3 from './screens/stepper/Step3Screen';

import OnboardingScreen from './screens/resume/OnboardingScreen';


import InterviewScreen from './screens/interview/InterviewScreen';


import MapScreen from './screens/maps/MapScreen';



//profile edit screen
import EditPersonalInfo from './screens/profile/editProfile/EditPersonalInfo';
import EditExperience from './screens/profile/editProfile/EditExpereince';
import EditProject from './screens/profile/editProfile/EditProject';
import EditCertification from './screens/profile/editProfile/EditCertification';
import EditEducation from './screens/profile/editProfile/EditEducation';
import EditSkill from './screens/profile/editProfile/EditSkill';
import EditLanguages from './screens/profile/editProfile/EditLanguages';
import EditInterests from './screens/profile/editProfile/EditInterests';

//browser screen
import QuestBrowserScreen from './screens/browser/QuestBrowserScreen';

//video screens
import VideoListScreen from './screens/video/VideoListScreen';
import VideoPlayerScreen from './screens/video/VideoPlayerScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

//Bottom Tab Navigator with custom icons from the assets folder


const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false, // Hide default labels
        headerShown: false, // Hide header for all stack screens
        tabBarStyle: {
          position: 'absolute',
          bottom: 20, // Adjusted for shadow spacing
          left: 0,
          right: 0,
          elevation: 5, // For Android shadow
          backgroundColor: '#fff',
          borderTopColor: 'transparent',
          height: 60,
          marginHorizontal: 20,
          borderRadius: 50,

          // Shadow properties for iOS
          shadowColor: '#000', // Black shadow
          shadowOffset: {width: 0, height: 10}, // Offset for the shadow
          shadowOpacity: 0.1, // Opacity of the shadow (10%)
          shadowRadius: 10, // Blurring of the shadow
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={icons.home}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: focused ? COLORS.primary : COLORS.black,
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={icons.person_cv}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: focused ? COLORS.primary : COLORS.black,
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={icons.messages}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? COLORS.primary : COLORS.black,
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="AnalyticsScreen"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={icons.history}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: focused ? COLORS.primary : COLORS.black,
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={icons.user}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: focused ? COLORS.primary : COLORS.black,
              }}
            />
          ),
        }}
      />
      {/* 
<Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.profile}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: focused ? COLORS.primary : COLORS.black,
              }}
            />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};

// Main App with the BottomTabNavigator inside a Stack Navigator
const Navigator = () => {

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}> 
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="JobSelectionScreen" component={JobSelectionScreen} />
          <Stack.Screen name="Step1" component={Step1} />
          <Stack.Screen name="Step2" component={Step2} />
          <Stack.Screen name="Step3" component={Step3} />

          <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
          <Stack.Screen name="FindJobScreen" component={FindjobScreen} />

           <Stack.Screen name="ResumeMakerScreen" component={ResumeMakerScreen} /> 
           <Stack.Screen name="ResumePreviewScreen" component={ResumePreviewScreen}/> 
         {/* <Stack.Screen name="pdfViewer" component={ResumePDFScreen} /> */}


          <Stack.Screen name="NewsScreen" component={NewsScreen} />
          <Stack.Screen name="VideoListScreen" component={VideoListScreen} />
          <Stack.Screen name="VideoPlayerScreen" component={VideoPlayerScreen} />

          <Stack.Screen name="InterviewPrepScreen" component={InterviewPrepScreen} />
          <Stack.Screen name="InterviewScreen" component={InterviewScreen} />
          <Stack.Screen name="QuestBrowserScreen" component={QuestBrowserScreen} />

          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
          />
          <Stack.Screen name="EditPersonalInfo" component={EditPersonalInfo} />
          <Stack.Screen name="EditExperience" component={EditExperience} />
          <Stack.Screen name="EditProject" component={EditProject} />
          <Stack.Screen
            name="EditCertification"
            component={EditCertification}
          />
          <Stack.Screen name="EditEducation" component={EditEducation} />
          <Stack.Screen name="EditSkills" component={EditSkill} />
          <Stack.Screen name="EditLanguages" component={EditLanguages} />
          <Stack.Screen name="EditInterests" component={EditInterests} />

          <Stack.Screen name="MapScreen" component={MapScreen} />



          <Stack.Screen name="Main" component={BottomTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default Navigator;