import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkX_tS8c7DyImhq91-h8XzcM1rtnFNQBA",
  authDomain: "dmapcreator.firebaseapp.com",
  projectId: "dmapcreator",
  storageBucket: "dmapcreator.appspot.com",
  messagingSenderId: "131939280958",
  appId: "1:131939280958:web:1d61d2de3e5e234de8896f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);