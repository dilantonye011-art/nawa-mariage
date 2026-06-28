import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANoD2AcMC909tdgLGVt33mCQdT2JuY2IA",
  authDomain: "nawa-mariage.firebaseapp.com",
  projectId: "nawa-mariage",
  storageBucket: "nawa-mariage.firebasestorage.app",
  messagingSenderId: "380451898758",
  appId: "1:380451898758:web:6735b168f624cccf8e1807",
};

// Évite d'initialiser plusieurs fois (Next.js hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);