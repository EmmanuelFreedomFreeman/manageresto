// Import the functions you need from the SDKs you need
import { initializeApp,getApps,getApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4Jx_xRjwq0grD0I0OI9E5qdefuEq6hSA",
  authDomain: "business-1c0e4.firebaseapp.com",
  projectId: "business-1c0e4",
  storageBucket: "business-1c0e4.appspot.com",
  messagingSenderId: "342444766081",
  appId: "1:342444766081:web:85cd9893b5f3ca9d68ae80"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth();
const db = getFirestore(app);

export {auth,db}

export default firebaseConfig;