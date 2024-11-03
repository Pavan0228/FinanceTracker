import express from "express";
import { setMonthlyLimit, getMonthlyLimits } from "../services/LimitService.js";
import client from "../../client.js";

const router = express.Router();

const redisHelper = {
    async get(key) {
        try {
            const data = await client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("Redis GET Error:", error);
            return null;
        }
    },
    async set(key, value, expires) {
        try {
            await client.set(key, JSON.stringify(value), {
                EX: expires, // expiration in seconds
            });
        } catch (error) {
            console.error("Redis SET Error:", error);
        }
    },
};

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
    const cachedMessages = await redisHelper.get(`MonthlyLimit:${userId}`);
    if (cachedMessages) {
        return res.status(200).send({
            message: "Monthly limits retrieved successfully",
            data: cachedMessages,
        });
    }



    try {
        // Call the service function to get monthly limits
        const result = await getMonthlyLimits(userId);
        await redisHelper.set(`MonthlyLimit:${userId}`, result, 60);
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
