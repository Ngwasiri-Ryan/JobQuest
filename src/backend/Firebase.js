// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { initializeAuth, getReactNativePersistence } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBYQJcPU2_tVkX5B6K9I3yQmmW1vKbt7Kw",
  authDomain: "jobquest-19789.firebaseapp.com",
  projectId: "jobquest-19789",
  storageBucket: "jobquest-19789.appspot.com",
  messagingSenderId: "975097210975",
  appId: "1:975097210975:web:2f0df3d8d4967c985513ea",
  measurementId: "G-868DRL86WF",
};

// Initialize Firebase (only once)
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

export { db, auth };
