// Router
import express from "express";
import { addInput } from "../services/InputService.js"; // Ensure correct extension for ESM

const router = express.Router();

router.post("/:id/input/:month/:year", async (req, res) => {
    const userId = req.params.id;
    const { amount, date, type } = req.body;
    const month = req.params.month;
    const year = req.params.year;

    try {
        // Validate the data before proceeding (e.g., check if `amount` is a number, etc.)
        if (!amount || !date || !type) {
            return res.status(400).send({ error: "Missing required fields" });
        }

        // Call the service function to add input
        const result = await addInput(userId, amount, date, type, month, year);
        res.status(200).send({
            message: "Input added successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error in adding input:", error);
        res.status(500).send({ error: "Failed to add input" });
    }
});

export default router;
