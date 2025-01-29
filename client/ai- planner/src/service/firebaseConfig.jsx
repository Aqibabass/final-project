// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7jLPLtNbf024m6KobrZau_4TQ8PdUHJM",
  authDomain: "ai-project-major.firebaseapp.com",
  projectId: "ai-project-major",
  storageBucket: "ai-project-major.firebasestorage.app",
  messagingSenderId: "289566919670",
  appId: "1:289566919670:web:ee1648383d3a35f33f95d7",
  measurementId: "G-BBK2MQEB26"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);