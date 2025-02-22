// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhd9JBpf7cFDPCMWV39hjfCUZ7ZAroMiA",
  authDomain: "oziza-5927b.firebaseapp.com",
  projectId: "oziza-5927b",
  storageBucket: "oziza-5927b.firebasestorage.app",
  messagingSenderId: "539163820187",
  appId: "1:539163820187:web:c37de811b6a1620545863e",
  measurementId: "G-RHWZN8Z78G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);