import express from "express";
import {
    getUserDataById,
} from "../services/userService.js";
import { login } from "../controllers/auth.controller.js";
import client from "../../client.js";

const router = express.Router();

router.route("/login").post(login);

// Route to get user data by ID with caching, but excluding profile image
router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    const cacheKey = `UserData:${userId}`; // Define a cache key based on user ID
    
    try {
        // Check Redis cache first
        const cachedUserData = await client.get(cacheKey);
        if (cachedUserData) {
            const userData = JSON.parse(cachedUserData);
            return res.status(200).send({
                message: "User data retrieved successfully",
                email: userData.email,
                name: userData.name,
                password: userData.password,
                profession: userData.profession,
                profile: userData?.profile?.profilePicUrl || null, // Don't cache the profile image
            });
        }

        // If not in cache, fetch from database
        const userData = await getUserDataById(userId);
        if (userData) {
            // Cache the user data in Redis for future requests (excluding the profile image)
            const { profilePicUrl, ...userDataWithoutProfile } = userData;
            await client.set(
                cacheKey,
                JSON.stringify(userDataWithoutProfile),
                {
                    EX: 60,
                }
            );

            res.status(200).send({
                message: "User data retrieved successfully",
                email: userData.email,
                name: userData.name,
                password: userData.password,
                profession: userData.profession,
                profile: userData?.profile?.profilePicUrl || null, // Fetch profile image from DB each time
            });
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error in /user/:id route:", error);
        res.status(500).send({ error: "Failed to retrieve user data" });
    }
});

export default router;
