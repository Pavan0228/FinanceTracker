import { db } from "../config/firebaseConfig.js"; // Import the db object

// Login function should receive `req` and `res` as parameters
export async function login(req, res) {
    // Destructure the body of the request
    const { email, password, name } = req.body;

    // Check if all fields are provided
    if (!email?.trim() || !password?.trim() || !name?.trim()) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Query the database for users with matching email and name
        const usersRef = db.ref("user");
        const snapshot = await usersRef
            .orderByChild("email")
            .equalTo(email)
            .once("value");

        const users = snapshot.val();
        let matchedUser = null;

        // Check if any user has the provided name
        if (users) {
            for (const userId in users) {
                if (users[userId].name === name &&users[userId].password === password ) {
                    matchedUser = users[userId];
                    break;
                }
            }
            
        }

        if (matchedUser) {
            // Return user data if found
            res.status(200).json({
                message: "User data found",
                userData: matchedUser,
            });
        } else {
            // Handle case when user is not found
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        // Handle any errors during database retrieval
        console.error("Error retrieving user data:", error);
        res.status(500).json({ message: "Failed to retrieve user data" });
    }
}
