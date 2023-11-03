// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvXdEpK_RQhgldKqO70rKiWbiFBuaQdY0",
  authDomain: "pattycare-bc862.firebaseapp.com",
  projectId: "pattycare-bc862",
  storageBucket: "pattycare-bc862.appspot.com",
  messagingSenderId: "281640162133",
  appId: "1:281640162133:web:5165585be6462a07b715dc",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth, provider, storage };
export default db;
