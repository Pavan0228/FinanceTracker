import { db } from "../config/firebaseConfig.js"; // Import the db object

export const setMonthlyLimit = async (userId, limit) => {
    try {
        const userRef = db.ref(`user/${userId}/monthlyLimit`);
        await userRef.set(limit); // Save the limit under the user's ID
        return { userId, limit };
    } catch (error) {
        console.error("Error setting monthly limit:", error);
        throw new Error("Failed to set monthly limit");
    }
};
