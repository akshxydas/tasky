import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCh6v1FeLy94YYO1JOCP8BAJoIZALzLM0U",
  authDomain: "tasky-a47d3.firebaseapp.com",
  projectId: "tasky-a47d3",
  storageBucket: "tasky-a47d3.firebasestorage.app",
  messagingSenderId: "695431963849",
  appId: "1:695431963849:web:b13102a30e66a29d32d918",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
