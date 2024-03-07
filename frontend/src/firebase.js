// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBB3aUW7of_6TvPoacswbYinahRv2jJM4g",
  authDomain: "case-module.firebaseapp.com",
  projectId: "case-module",
  storageBucket: "case-module.appspot.com",
  messagingSenderId: "114767769495",
  appId: "1:114767769495:web:0419a0480f9820fb22ded2",
  measurementId: "G-G1RGJK5RYF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
