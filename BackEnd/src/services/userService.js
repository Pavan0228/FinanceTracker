import { db } from "../config/firebaseConfig.js"; // Import the db object

import { createHash, createDecipheriv } from "crypto";

const MY_SECRET_KEY = "@7djsridher";

// Function to generate the AES key (same as in Java)
function generateKey() {
    const hash = createHash("sha256").update(MY_SECRET_KEY).digest(); // SHA-256 hash
    return hash.slice(0, 16); // Use only the first 16 bytes (AES-128 key)
}

// Function to decrypt AES-encrypted text in base64 format
function decrypt(encryptedText) {
    const key = generateKey();
    const decipher = createDecipheriv("aes-128-ecb", key, null); // ECB mode, no IV
    decipher.setAutoPadding(true); // Ensure PKCS5/PKCS7 padding is handled

    let decrypted = decipher.update(encryptedText.trim(), "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}



// Function to create or update user data
export async function createUser(userData) {
    const userRef = db.ref(`users/${userData.id}`);
    await userRef.set(userData);
}

// Function to get user data by ID
export async function getUserDataById(userId) {
    try {
        const snapshot = await db.ref(`user/${userId}`).once("value");
        const userData = snapshot.val();

        // Check if user data exists and is not an empty object
        if (userData) {
            // The data is nested under the userId key
            return userData;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error retrieving user data:", error);
        throw new Error("Failed to retrieve user data");
    }
}

export async function getUserMessagesById(userId) {
    try {
        const snapshot = await db.ref(`user/${userId}/messages`).once("value");
        const messages = snapshot.val();

        // Check if messages exist and convert to an array
        if (messages) {
            const messageArray = Object.values(messages); // Convert object to array
            console.log(messageArray)
            // Decrypt the messages
            const decryptedMessages = messageArray.map((msg) => ({
                amount: decrypt(msg.amount),
                date: decrypt(msg.date),
                sender: msg.sender, 
                type: decrypt(msg.Type),
            }));

            return decryptedMessages; // Return decrypted messages
        } else {
            return []; // Return an empty array if no messages found
        }
    } catch (error) {
        console.error("Error retrieving user messages:", error);
        throw new Error("Failed to retrieve user messages");
    }
}

// Function to calculate total debits and credits
export const calculateTotalDebitsAndCredits = (messages) => {
    let totalDebit = 0;
    let totalCredit = 0;

    if (messages) {
        for (const messageId in messages) {

            const message = messages[messageId];
            if (message.type === "Debited") {
                totalDebit += parseFloat(message.amount);
            } else if (message.type === "Credited") {
                totalCredit += parseFloat(message.amount);
            }
        }
    }

    return {
        totalDebit,
        totalCredit,
    };
};
