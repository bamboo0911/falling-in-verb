
import * as firebaseApp from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Workaround for Gstatic CDN issue
// Gstatic scripts attach 'firebase' to the global window object.
// We prioritize window.firebase, then fall back to module imports.
const firebase = (window as any).firebase || (firebaseApp as any).default || firebaseApp;

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtDRTulLHM_5UM8LtG1Ac9lZZUZUwTSAw",
  authDomain: "falling-in-verb.firebaseapp.com",
  projectId: "falling-in-verb",
  storageBucket: "falling-in-verb.firebasestorage.app",
  messagingSenderId: "940608160292",
  appId: "1:940608160292:web:3deefff336986b24958eb1",
  measurementId: "G-CR015YCWX3"
};

// Initialize Firebase if it hasn't been initialized yet
// guard against firebase being undefined to prevent "cannot read properties of undefined"
if (firebase && firebase.apps && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Auth instance
const auth = firebase?.auth();

// Initialize Firestore instance
const db = firebase?.firestore();

// Export the sanitized firebase instance along with auth and db
export { firebase, auth, db };
export default firebase;
