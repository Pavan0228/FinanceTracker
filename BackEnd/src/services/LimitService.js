import { db } from "../config/firebaseConfig.js"; // Import the db object

export const setMonthlyLimit = async (userId, limit, month, year) => {
    try {
        // Save the limit under user -> monthlyLimit -> year -> month
        const userRef = db.ref(`user/${userId}/monthlyLimit/${year}/${month}`);
        await userRef.set({
            limit,
        });

        return { userId, limit, month, year };
    } catch (error) {
        console.error("Error setting monthly limit:", error);
        throw new Error("Failed to set monthly limit");
    }
};

export const getMonthlyLimits = async (userId) => {
    try {
        // Reference to the user's monthlyLimit node
        const userRef = db.ref(`user/${userId}/monthlyLimit`);

        // Get the data snapshot from Firebase
        const snapshot = await userRef.once("value");

        // Check if data exists
        if (!snapshot.exists()) {
            throw new Error("No monthly limits found");
        }

        // Return the retrieved data as JSON
        return snapshot.val();
    } catch (error) {
        console.error("Error retrieving monthly limits:", error);
        throw new Error("Failed to retrieve monthly limits");
    }
};
