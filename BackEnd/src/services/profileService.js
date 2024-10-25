import { db } from "../config/firebaseConfig.js";

export const updateProfilePicture = async (userId, imageUrl) => {
    try {
        // Reference to user profile data
        const userRef = db.ref(`user/${userId}/profile`);
        
        // Update profile picture URL
        await userRef.update({
            profilePicUrl: imageUrl,
            updatedAt: Date.now()
        });
        
        return {
            success: true,
            userId,
            profilePicUrl: imageUrl
        };
    } catch (error) {
        console.error("Error updating profile picture:", error);
        throw new Error("Failed to update profile picture");
    }
};

// Get user profile data
export const getUserProfile = async (userId) => {
    try {
        const userRef = db.ref(`user/${userId}/profile`);
        const snapshot = await userRef.once('value');
        return snapshot.val();
    } catch (error) {
        console.error("Error getting user profile:", error);
        throw new Error("Failed to get user profile");
    }
};