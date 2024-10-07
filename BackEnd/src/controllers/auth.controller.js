import { db } from "../config/firebaseConfig.js"; // Import the db object

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
            res.status(200).json({
                message: "User logged in successfully",
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

