// src/index.js

import express from "express";
import { getUserDataById, createUser } from "./services/userService.js";
import { initializeFirebaseApp } from "./db/firebase.js";

// Initialize Firebase
initializeFirebaseApp();

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define a route to create or update user data
app.post("/user", async (req, res) => {
    const userData = req.body;
    try {
        if (!userData || !userData.id) {
            return res.status(400).send({ error: "User ID is required" });
        }

        await createUser(userData);

        res.status(200).send({ message: "User data saved successfully" });
    } catch (error) {
        console.error("Error in /user route:", error);
        res.status(500).send({ error: "Failed to save user data" });
    }
});

// Define a route to get user data by ID
app.get("/user/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const userData = await getUserDataById(userId);
        if (userData) {
            res.status(200).send({
                message: "User data retrieved successfully",
                data: userData,
            });
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error in /user/:id route:", error);
        res.status(500).send({ error: "Failed to retrieve user data" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
