// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCB5mbmxqqYuwcPQkls8BePYSUp4hw7UvI",
  authDomain: "admin-glucoaid.firebaseapp.com",
  projectId: "admin-glucoaid",
  storageBucket: "admin-glucoaid.firebasestorage.app",
  messagingSenderId: "147220505427",
  appId: "1:147220505427:web:7ec327300943ceb0b5b7a6",
  measurementId: "G-DTSXY5SMZX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
