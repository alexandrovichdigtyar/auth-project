import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCibPU1P1q4gAyrY1GjRpmvZWdci4J1-So',
  authDomain: 'auth-fb-1eada.firebaseapp.com',
  projectId: 'auth-fb-1eada',
  storageBucket: 'auth-fb-1eada.appspot.com',
  messagingSenderId: '451817668413',
  appId: '1:451817668413:web:090f49f562e46277378f54',
  measurementId: 'G-2KYLNJHCFT',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
