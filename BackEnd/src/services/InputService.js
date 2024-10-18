// Service (InputService.js)
import { db } from "../config/firebaseConfig.js"; // Import the db object

export const addInput = async (userId, amount, date, type, month, year) => {
    try {
        // Reference to user inputs for the given year and month
        const userRef = db.ref(`user/${userId}/input/${year}/${month}`);

        // Push new input
        const newInputRef = await userRef.push({
            amount,
            date,
            type,
        });

        // Return data, including the unique key for the newly added input
        return {
            userId,
            amount,
            date,
            type,
            month,
            year,
        };
    } catch (error) {
        console.error("Error adding input:", error);
        throw new Error("Failed to add input");
    }
};
