import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Импортируем типы отдельно
import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";
import { getStorage } from 'firebase/storage';


// Твой конфиг
const firebaseConfig = { 
  apiKey : "AIzaSyASJb-bOkj1V0Zoxlu8STmj3e2nndTMmrM" , 
  authDomain : "storefishminiapp.firebaseapp.com" , 
  projectId : "storefishminiapp" , 
  storageBucket : "storefishminiapp.firebasestorage.app" , 
  messagingSenderId : "248863675377" , 
  appId : "1:248863675377:web:2ff562e57e9372f0a46a50" , 
  measurementId : "G-QLLWNLTMBH" 
};

// Инициализация
const app: FirebaseApp = initializeApp(firebaseConfig);

// Экспорты
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage = getStorage(app);