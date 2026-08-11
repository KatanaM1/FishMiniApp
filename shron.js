import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyASJb-bOkj1V0Zoxlu8STmj3e2nndTMmrM",
  authDomain: "storefishminiapp.firebaseapp.com",
  projectId: "storefishminiapp",
  storageBucket: "storefishminiapp.firebasestorage.app",
  messagingSenderId: "248863675377",
  appId: "1:248863675377:web:2ff562e57e9372f0a46a50",
  measurementId: "G-QLLWNLTMBH"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);