import express from "express";
import { setMonthlyLimit } from "../services/LimitService.js"; // Assume you have a service to handle the logic

const router = express.Router();


// Define a POST route for setting the monthly limit
router.post("/user/:id", async (req, res) => {
    const userId = req.params.id;
    const { limit } = req.body; // Extract the monthly limit from the request body

    try {
        if (!limit || isNaN(limit)) {
            return res.status(400).send({ message: "Invalid limit" });
        }
        const result = await setMonthlyLimit(userId, limit); 

        res.status(201).send({
            message: "Monthly limit set successfully",
            data: result, 
        });
    } catch (error) {
        console.error("Error in /user/:id/monthly-limit POST route:", error);
        res.status(500).send({ error: "Failed to set monthly limit" });
    }
});


export default router;
