// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAra7mrgrEJJ1r5EBrbU-79yxzhm7U-CGg",
  authDomain: "imposter-game-74cac.firebaseapp.com",
  projectId: "imposter-game-74cac",
  storageBucket: "imposter-game-74cac.firebasestorage.app",
  messagingSenderId: "805951022668",
  appId: "1:805951022668:web:779d8e7439b192cbe476e9",
  measurementId: "G-KF1FHRQ4F8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);