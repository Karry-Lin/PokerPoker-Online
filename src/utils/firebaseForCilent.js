import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

export const getDatabase = async () => {
  const response = await fetch('/api/firebase');
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }
  const firebase = initializeApp(data);
  return getFirestore(firebase, '(default)');
};
