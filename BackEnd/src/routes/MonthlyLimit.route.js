import express from "express";
import { setMonthlyLimit } from "../services/limitService.js";

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

export default router;
