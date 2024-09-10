// src/services/userService.js

import { getFirestoreDb } from "../db/firebase.js";
import { doc, setDoc, getDoc } from "firebase/firestore";

const getUserDataById = async (userId) => {
    const firestoreDb = getFirestoreDb();
    if (!firestoreDb) {
        console.error("Firestore is not initialized. Please initialize Firebase first.");
        return null;
    }

    try {
        const userDoc = doc(firestoreDb, "users", userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving user data from Firebase:", error);
        throw new Error("Failed to retrieve user data");
    }
};

const createUser = async (userData) => {
    const firestoreDb = getFirestoreDb();
    if (!firestoreDb) {
        console.error("Firestore is not initialized. Please initialize Firebase first.");
        return;
    }

    try {
        const userRef = doc(firestoreDb, "users", userData.id);
        await setDoc(userRef, userData, { merge: true });
        console.log("User data saved successfully.");
    } catch (error) {
        console.error("Error saving user data to Firebase:", error);
        throw new Error("Failed to save user data");
    }
};

export { getUserDataById, createUser };
