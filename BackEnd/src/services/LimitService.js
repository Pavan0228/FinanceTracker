import { db } from "../config/firebaseConfig.js"; // Import the db object 

export const setMonthlyLimit = async (userId, limit, month, year) => {
    try {
        // Save the limit under user -> monthlyLimit -> year -> month
        const userRef = db.ref(`user/${userId}/monthlyLimit/${year}/${month}`);
        await userRef.set({
            limit
        });

        return { userId, limit, month, year };
    } catch (error) {
        console.error("Error setting monthly limit:", error);
        throw new Error("Failed to set monthly limit");
    }
};
