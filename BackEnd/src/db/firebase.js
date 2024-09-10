// src/config/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

let app;
let firestoreDb;

const initializeFirebaseApp = () => {
    try {
        app = initializeApp(firebaseConfig);
        firestoreDb = getFirestore(app); // Ensure Firestore is initialized with the correct app instance
        console.log("Firebase initialized successfully");
        return app;
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
};

const getFirebaseApp = () => app;
const getFirestoreDb = () => firestoreDb;

export { initializeFirebaseApp, getFirebaseApp, getFirestoreDb };
