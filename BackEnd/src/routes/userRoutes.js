import express from "express";
import {
    getUserDataById,
} from "../services/userService.js";
import { login } from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/login").post(login);

// Route to get user data by ID with caching, but excluding profile image
router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    
    try {
        const userData = await getUserDataById(userId);
        if (userData) {
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
