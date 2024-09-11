import { db } from "../config/firebaseConfig.js"; // Import the db object

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

        // Check if messages exist and is not an empty object
        if (messages) {
            return messages;
        } else {
            return null;
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
            // console.log("type",messages[messageId].type);
            // console.log("amount",messages[messageId].amount);
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
