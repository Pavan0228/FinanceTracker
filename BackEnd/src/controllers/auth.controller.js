import { db } from "../config/firebaseConfig.js"; // Import the db object
import { User } from "../models/User.model.js";
import admin from "firebase-admin";

const generateAccessToken = async (userId) => {
    try {
        const snapshot = await db.ref(`user/${userId}`).once("value");

        const userData = snapshot.val();

        if (!userData) {
            throw new Error("User not found");
        }

        const user = new User(userData.id, userData.name, userData.email);

        const accessToken = user.generateAccessToken();


        return { accessToken };
    } catch (error) {
        throw new Error(
            `Something went wrong while generating refresh and access token: ${error.message}`
        );
    }
};

export async function login(req, res) {
    const { idToken } = req.body;
    if (!idToken) {
        return res.status(400).json({ message: "ID token is required" });
    }

    try {
        // Verify the ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const userRecord = await admin.auth().getUser(uid);
        const accessToken = await generateAccessToken(uid); // assuming generateAccessToken returns an accessToken directly
        
        // Respond with user data
        return res.status(200).json({
            message: "User logged in successfully",
            uid: userRecord.uid,
            email: userRecord.email || "No email",
            displayName: userRecord.displayName || "User",
            accessToken
        });
    } catch (error) {
        console.error("Error verifying ID token:", error.message);
        return res.status(401).json({ message: "Invalid or expired ID token" });
    }
}
