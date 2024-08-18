import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "chatgpt-build-yt.firebaseapp.com",
  projectId: "chatgpt-build-yt",
  storageBucket: "chatgpt-build-yt.appspot.com",
  messagingSenderId: "544086688079",
  appId: "1:544086688079:web:52ea4f3ccfce74b06a053a",
};

//next.js approach
//singleton pattern
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
