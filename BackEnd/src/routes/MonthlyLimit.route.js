import express from "express";
import { setMonthlyLimit,getMonthlyLimits } from "../services/LimitService.js";

const router = express.Router();

// POST request to set monthly limit with specified month and year
router.post("/user/:id/monthly-limit", async (req, res) => {
    const userId = req.params.id;
    const { limit, month, year } = req.body;

    try {
        // Call the service function to set the monthly limit
        const result = await setMonthlyLimit(userId, limit, month, year);
        res.status(200).send({
            message: "Monthly limit set successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error in setting monthly limit:", error);
        res.status(500).send({ error: "Failed to set monthly limit" });
    }
});

// GET request to fetch monthly limits for a user
router.get("/user/:id/monthly-limit", async (req, res) => {
    const userId = req.params.id;
    console.log(userId)
    try {
        // Call the service function to get monthly limits
        const result = await getMonthlyLimits(userId);
        res.status(200).send({
            message: "Monthly limits retrieved successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error in retrieving monthly limits:", error);
        res.status(500).send({ error: "Failed to retrieve monthly limits" });
    }
});

export default router;
