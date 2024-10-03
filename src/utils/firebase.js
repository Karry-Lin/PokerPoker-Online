import firebase from "firebase/compat/app";

async function initializeFirebase() {
  const response = await fetch('/api/firebaseConfig');
  const options = await response.json();
  if (!firebase.apps.length) {
    firebase.initializeApp(options);
  }
  return firebase;
}
export default initializeFirebase;
