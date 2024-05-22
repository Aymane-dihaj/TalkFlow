import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatbox-9f007.firebaseapp.com",
  projectId: "chatbox-9f007",
  storageBucket: "chatbox-9f007.appspot.com",
  messagingSenderId: "352970459795",
  appId: "1:352970459795:web:326f95a390d7dd00719b66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();