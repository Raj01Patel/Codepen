import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDmkJcPr3izSeTJ2DRO1pipOXptSNfat-4",
    authDomain: "codepen-47b41.firebaseapp.com",
    projectId: "codepen-47b41",
    storageBucket: "codepen-47b41.appspot.com",
    messagingSenderId:"394823475501",
    appId: "1:394823475501:web:ebca131d2d63c4ede733a4"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, db, auth };

