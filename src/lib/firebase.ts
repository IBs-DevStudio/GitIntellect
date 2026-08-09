// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBQhDFEHxNSm7EI4JeIeWD6dKwFj2JEVc",
  authDomain: "gitintellect.firebaseapp.com",
  projectId: "gitintellect",
  storageBucket: "gitintellect.firebasestorage.app",
  messagingSenderId: "862269883914",
  appId: "1:862269883914:web:6ecc523da2a96a2dc141f3",
  measurementId: "G-WGR9K3CLVZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);