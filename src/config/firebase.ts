
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA9c_BSsShmvNOSAvwNpdambeyWVVo-UM0",
  authDomain: "prompt-to-python-pal.firebaseapp.com",
  projectId: "prompt-to-python-pal",
  storageBucket: "prompt-to-python-pal.firebasestorage.app",
  messagingSenderId: "373139309767",
  appId: "1:373139309767:web:d2f4552b2593e20e57aae2",
  measurementId: "G-44FEXXGYQM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
