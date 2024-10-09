import { db } from "../config/firebaseConfig.js"; // Import the db object
import { User } from "../models/User.model.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const usersRef = db.ref("user");
        const snapshot = await usersRef
            .orderByChild("id")
            .equalTo(userId)
            .once("value");

        const userData = snapshot.val();

        if (!userData) {
            throw new Error("User not found");
        }

        const user = new User(userData.id, userData.name, userData.email);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await usersRef.child(userId).update({ refreshToken });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error(
            `Something went wrong while generating refresh and access token: ${error.message}`
        );
    }
};


export async function login(req, res) {
    // Destructure the body of the request (only email and password)
    const { email, password } = req.body;

    // Check if both fields are provided
    if (!email?.trim() || !password?.trim()) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Query the database for users with matching email
        const usersRef = db.ref("user");
        const snapshot = await usersRef
            .orderByChild("email")
            .equalTo(email)
            .once("value");

        const users = snapshot.val();
        let matchedUser = null;

        // Check if any user has the provided password
        if (users) {
            for (const userId in users) {
                if (users[userId].password === password) {
                    matchedUser = users[userId];
                    break;
                }
            }
        }

        if (matchedUser) {
            // Return user data if found

            const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(matchedUser.id);

            res.status(200).json({
                message: "User logged in successfully",
                accessToken,
                refreshToken,
            });
        } else {
            // Handle case when email or password does not match
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        // Handle any errors during database retrieval
        console.error("Error retrieving user data:", error);
        res.status(500).json({ message: "Failed to retrieve user data" });
    }
}

