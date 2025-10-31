import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import type { FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';

interface FirebaseConfig extends FirebaseOptions {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig : FirebaseConfig ={
  apiKey: "AIzaSyAfzVuHVBbvSH3EJkeulMPLnr3xGcE4koM",
  authDomain: "real-estate-c8077.firebaseapp.com",
  projectId: "real-estate-c8077",
  storageBucket: "real-estate-c8077.firebasestorage.app",
  messagingSenderId: "591882201882",
  appId: "1:591882201882:web:25ee5ca35bb5417e2a5aa3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };