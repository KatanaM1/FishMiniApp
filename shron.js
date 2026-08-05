// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASJb-bOkj1V0Zoxlu8STmj3e2nndTMmrM",
  authDomain: "storefishminiapp.firebaseapp.com",
  projectId: "storefishminiapp",
  storageBucket: "storefishminiapp.firebasestorage.app",
  messagingSenderId: "248863675377",
  appId: "1:248863675377:web:2ff562e57e9372f0a46a50",
  measurementId: "G-QLLWNLTMBH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);