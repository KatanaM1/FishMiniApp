import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Импортируем типы отдельно
import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";

// Твой конфиг
const firebaseConfig = {
  apiKey: "....",
  authDomain: "....",
  projectId: "....",
  storageBucket: "....",
  messagingSenderId: "....",
  appId: "...."
};

// Инициализация
const app: FirebaseApp = initializeApp(firebaseConfig);

// Экспорты
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);