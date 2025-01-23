import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, inMemoryPersistence, browserLocalPersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from './firebaseConfig';
import { doc, getDoc, addDoc, collection, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const app = initializeApp(firebaseConfig);
let auth;

if (Platform.OS === 'web') {
  auth = initializeAuth(app, {
    persistence: browserLocalPersistence // ใช้สำหรับเว็บ
  });
} else {
  auth = initializeAuth(app, {
    persistence: inMemoryPersistence // ใช้ใน React Native แทน getReactNativePersistence
  });
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, signInWithEmailAndPassword, createUserWithEmailAndPassword, doc, getDoc, addDoc, collection };

