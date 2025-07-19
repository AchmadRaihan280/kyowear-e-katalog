// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCAA4HuU3B1XVa2miBQg-0b7NlxXvh_DUI",
  authDomain: "katalog-af771.firebaseapp.com",
  projectId: "katalog-af771",
  storageBucket: "katalog-af771.firebasestorage.app",
  messagingSenderId: "1026071280261",
  appId: "1:1026071280261:web:e2989e388ed585e3b147ec",
  measurementId: "G-YFEB6JVHYC",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth };

export { db };
