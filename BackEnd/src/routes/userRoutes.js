// src/routes/userRoutes.js
import express from "express";
import {
    getUserDataById,
    getUserMessagesById,
    calculateTotalDebitsAndCredits,
} from "../services/userService.js";

const router = express.Router();

// Route to get user data by ID
router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const userData = await getUserDataById(userId);
        if (userData) {
            res.status(200).send({
                message: "User data retrieved successfully",
                email: userData.email,
                name: userData.name,
                password:userData.password
            });
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error in /user/:id route:", error);
        res.status(500).send({ error: "Failed to retrieve user data" });
    }
});

// Route to get user messages by ID
router.get("/:id/messages", async (req, res) => {
    const userId = req.params.id;
    try {
        const messages = await getUserMessagesById(userId);
        if (messages) {
            res.status(200).send({
                message: "User messages retrieved successfully",
                data: messages,
            });
        } else {
            res.status(404).send({
                message: "No messages found for this user",
            });
        }
    } catch (error) {
        console.error("Error in /user/:id/messages route:", error);
        res.status(500).send({ error: "Failed to retrieve user messages" });
    }
});

// Route to get total debit and credit amounts
router.get("/:id/total", async (req, res) => {
    const userId = req.params.id;
    try {
        const messages = await getUserMessagesById(userId);
        if (messages) {
            const totals = calculateTotalDebitsAndCredits(messages);
            console.log(totals)
            res.status(200).send({
                message:
                    "Total debit and credit amounts retrieved successfully",
                totalDebit: totals.totalDebit,
                totalCredit: totals.totalCredit,
            });
        } else {
            res.status(404).send({
                message: "No messages found for this user",
            });
        }
    } catch (error) {
        console.error("Error in /user/:id/total route:", error);
        res.status(500).send({
            error: "Failed to calculate total debit and credit amounts",
        });
    }
});

export default router;
