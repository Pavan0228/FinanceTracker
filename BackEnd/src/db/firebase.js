import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

const serviceAccountPath = path.resolve("src/config/firebaseConfig.json");
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

let initialized = false;

export function initializeFirebaseApp() {
    if (!initialized) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://finandetails-default-rtdb.firebaseio.com", // Replace with your database URL
        });
        initialized = true;
    }
}

export const db = admin.database();
