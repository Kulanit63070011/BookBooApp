// backend/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; // ลบการนำเข้า 'initializeAuth'
import AsyncStorage from '@react-native-async-storage/async-storage'; // เพิ่ม AsyncStorage
import { firebaseConfig } from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword };
