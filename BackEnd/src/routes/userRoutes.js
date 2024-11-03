import express from "express";
import {
    getUserDataById,
    getUserMessagesById,
    calculateTotalDebitsAndCredits,
} from "../services/userService.js";
import { login } from "../controllers/auth.controller.js";
import client from "../../client.js";

const router = express.Router();

router.route("/login").post(login);

// Route to get user data by ID with caching
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
                profile: userData?.profile?.profilePicUrl || null,
            });
        }

        // If not in cache, fetch from database
        const userData = await getUserDataById(userId);
        if (userData) {
            // Cache the user data in Redis for future requests
            await client.set(
                cacheKey,
                JSON.stringify(userData),
                {
                    EX: 3600, // Cache expires in 1 hour (3600 seconds)
                }
            );

            res.status(200).send({
                message: "User data retrieved successfully",
                email: userData.email,
                name: userData.name,
                password: userData.password,
                profession: userData.profession,
                profile: userData?.profile?.profilePicUrl || null,
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