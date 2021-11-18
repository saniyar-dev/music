import { initializeApp } from 'firebase/app';
import {
  getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut,
} from 'firebase/auth';
import {
  getFirestore, collection, addDoc, setDoc, doc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBXKVtUm0P6Vzkm6HHq0Y7Khuk9PaK1loM',
  authDomain: 'music-5d5dc.firebaseapp.com',
  projectId: 'music-5d5dc',
  storageBucket: 'music-5d5dc.appspot.com',
  messagingSenderId: '877227899970',
  appId: '1:877227899970:web:97e7c1d5c6d311c71081db',
};

initializeApp(firebaseConfig);

const auth = getAuth;
const createUser = createUserWithEmailAndPassword;
const signIn = signInWithEmailAndPassword;

const db = getFirestore();
const usersCollection = collection(db, 'users');

export {
  auth,
  createUser,
  usersCollection,
  addDoc,
  setDoc,
  doc,
  onAuthStateChanged,
  signIn,
  signOut,
};
