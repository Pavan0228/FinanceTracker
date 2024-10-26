import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

<<<<<<< HEAD
// Correct path to the service account key
=======
// Path to the service account key
>>>>>>> cb0861ccf28914573239e7f3a487d96d9da6de25
const serviceAccountPath = path.resolve("./src/config/firebaseConfig.json");
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

console.log(serviceAccountPath)
// Initialize Firebase app if it hasn't been initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://finandetails-default-rtdb.firebaseio.com", // Replace with your database URL
    });
}

// Export Firebase database instance
export const db = admin.database();

