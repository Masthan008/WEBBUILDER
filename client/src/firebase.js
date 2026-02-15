// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "genwebai-73008.firebaseapp.com",
  projectId: "genwebai-73008",
  storageBucket: "genwebai-73008.firebasestorage.app",
  messagingSenderId: "1041039149073",
  appId: "1:1041039149073:web:d56abdcc6cf26a428389b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)
const provider=new GoogleAuthProvider()

export {auth,provider}
