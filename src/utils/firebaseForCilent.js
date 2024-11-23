import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

let database = null;

export const getDatabase = async () => {
  console.log(`getDatabase is null: ${database === null}`);
  if (database) return database;
  const response = await fetch('/api/firebase');
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }
  const firebase = initializeApp(data);
  database = getFirestore(firebase, '(default)');
  return database;
};
