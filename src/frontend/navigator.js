import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { UserProvider } from './hooks/UserContext';
import { icons, COLORS } from './constants';
import { Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
import ResumePDFScreen from './screens/resume/ResumePDFScreen';


import Step1 from './screens/stepper/Step1Screen';
import Step2 from './screens/stepper/Step2Screen';
import Step3 from './screens/stepper/Step3Screen';

import OnboardingScreen from './screens/resume/OnboardingScreen';


import InterviewScreen from './screens/interview/InterviewScreen';


import MapScreen from './screens/maps/MapScreen';


import DocumentBuilderScreen from './screens/resume/DocumentBuilderScreen';
import CoverLetterPreviewScreen from './screens/resume/cover_letter/CoverLetterPreviewScreen';
import CoverLetterStepper from './screens/resume/cover_letter/CoverLetterStepper';


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
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarShowLabel: false, // Hide default labels
      headerShown: false, // Hide header for all stack screens
      tabBarStyle: {
        position: 'absolute',
        bottom: insets.bottom ? insets.bottom + 10 : 20, // Adjusts dynamically
        left: 20, 
        right: 20,
        backgroundColor: COLORS.black,
        borderTopColor: 'transparent',
        marginHorizontal: 10,
        paddingTop: 15,
        height: 60,
        borderRadius: 50,
        flexDirection: 'row', // Ensures icons are in a row
        alignItems: 'center', // Aligns icons to the center vertically
        justifyContent: 'space-evenly', // Distributes icons evenly across the tab bar
        paddingHorizontal: 20, // Ensures some spacing around icons
      },
    }}
    
      >
     <Tab.Screen
  name="Home"
  component={HomeScreen}
  options={{
    tabBarIcon: ({ focused }) => (
      <View
        style={{
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 20, // Circular shape
          backgroundColor: focused ? COLORS.white : 'transparent', // White background when active
        }}
      >
        <Image
          source={icons.home}
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
            tintColor: focused ? COLORS.black : COLORS.white,
          }}
        />
      </View>
    ),
  }}
/>


<Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20, // Circular shape
              backgroundColor: focused ? COLORS.white : 'transparent', // White background when active
            }}
          >
            <Image
              source={icons.map}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? COLORS.black : COLORS.white,
              }}
            />
             </View>
          ),
        }}
      />

      <Tab.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20, // Circular shape
              backgroundColor: focused ? COLORS.white : 'transparent', // White background when active
            }}
          >
            <Image
              source={icons.person_cv}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: focused ? COLORS.black : COLORS.white,
              }}
            />
             </View>
          ),
        }}
      />

      <Tab.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20, // Circular shape
              backgroundColor: focused ? COLORS.white : 'transparent', // White background when active
            }}
          >
            <Image
              source={icons.messages}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? COLORS.black : COLORS.white,
              }}
            />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="AnalyticsScreen"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20, // Circular shape
              backgroundColor: focused ? COLORS.white : 'transparent', // White background when active
            }}
          >
            <Image
              source={icons.history}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: focused ? COLORS.black : COLORS.white,
              }}
            />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20, // Circular shape
              backgroundColor: focused ? COLORS.white : 'transparent', // White background when active
            }}
          >
            <Image
              source={icons.user}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: focused ? COLORS.black : COLORS.white,
              }}
            />
            </View>
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

          <Stack.Screen name="pdfViewer" component={ResumePDFScreen} />

          <Stack.Screen name="DocumentBuilderScreen" component={ DocumentBuilderScreen} />
          <Stack.Screen name="CoverLetterStepper" component={ CoverLetterStepper} />
          <Stack.Screen name="CoverLetterPreviewScreen" component={CoverLetterPreviewScreen} />



          <Stack.Screen name="Main" component={BottomTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default Navigator;