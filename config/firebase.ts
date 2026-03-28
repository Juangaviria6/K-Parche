import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCI5FYXxHbyuBUkmwSHdVD_8uwjfh5apIc",
  authDomain: "k-parche.firebaseapp.com",
  projectId: "k-parche",
  storageBucket: "k-parche.firebasestorage.app",
  messagingSenderId: "115578472603",
  appId: "1:115578472603:web:4087a34654a77886d3de3e"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with async storage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
