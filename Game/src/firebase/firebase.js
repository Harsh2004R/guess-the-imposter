import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAra7mrgrEJJ1r5EBrbU-79yxzhm7U-CGg",
  authDomain: "imposter-game-74cac.firebaseapp.com",
  projectId: "imposter-game-74cac",
  storageBucket: "imposter-game-74cac.firebasestorage.app",
  messagingSenderId: "805951022668",
  appId: "1:805951022668:web:779d8e7439b192cbe476e9",
  measurementId: "G-KF1FHRQ4F8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getDatabase(
  app,
  "https://imposter-game-74cac-default-rtdb.asia-southeast1.firebasedatabase.app",
);

export const loginAnon = () => signInAnonymously(auth);
