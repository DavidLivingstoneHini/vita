import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBhd9JBpf7cFDPCMWV39hjfCUZ7ZAroMiA",
  authDomain: "oziza-5927b.firebaseapp.com",
  projectId: "oziza-5927b",
  storageBucket: "oziza-5927b.firebasestorage.app",
  messagingSenderId: "539163820187",
  appId: "1:539163820187:web:c37de811b6a1620545863e",
  measurementId: "G-RHWZN8Z78G",
  databaseURL: "https://oziza-5927b-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
