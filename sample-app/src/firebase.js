import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyCeLB2awC2lh1bDdy2dRax3mAZtIVG6Kzs",
  authDomain: "contracty-5f269.firebaseapp.com",
  projectId: "contracty-5f269",
  storageBucket: "contracty-5f269.firebasestorage.app",
  messagingSenderId: "279435736496",
  appId: "1:279435736496:web:1f98050fad937035b11275"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);