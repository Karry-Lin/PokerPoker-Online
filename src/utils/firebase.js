import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";
import {getFirestore} from "firebase/firestore";

export const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};
const firebase = initializeApp(firebaseConfig, "server");
export const database = getFirestore(firebase, '(default)');
export const storage = getStorage(firebase);

export const getDatabase = async () => {
  const response = await fetch('/api/firebase');
  const config = await response.json();
  const firebase = initializeApp(config, "client");
  return getFirestore(firebase, '(default)');
};
