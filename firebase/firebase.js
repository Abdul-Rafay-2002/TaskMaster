// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import  {getFirestore}  from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqWfbht27agOUkUH1oFsMGrkq1-g7C-ms",
    authDomain: "task-master-5d1fe.firebaseapp.com",
    projectId: "task-master-5d1fe",
    storageBucket: "task-master-5d1fe.appspot.com",
    messagingSenderId: "193288802911",
    appId: "1:193288802911:web:479869c3aeb9b3e8d841ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);