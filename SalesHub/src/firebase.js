// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAZXiaonbY2W6XbYIaQ3Vd1YbZTpOmXKWI",
  authDomain: "saleshub-3d801.firebaseapp.com",
  projectId: "saleshub-3d801",
  storageBucket: "saleshub-3d801.appspot.com",
  messagingSenderId: "1090491520052",
  appId: "1:1090491520052:web:1c0efc1132832cd8376661"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;