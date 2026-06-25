// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD47PnrJfjS5dUFobKHy7NC2CKVsOQwYLI",
  authDomain: "bansach-6c9a7.firebaseapp.com",
  projectId: "bansach-6c9a7",
  storageBucket: "bansach-6c9a7.appspot.com",
  messagingSenderId: "616526754513",
  appId: "1:616526754513:web:479616bf2753821c118bf0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db=getFirestore(app);
export {auth,db}