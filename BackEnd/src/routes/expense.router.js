// routes/user.router.js
import express from "express";
import {
    getUserDataById,
    getUserMessagesById,
    calculateTotalDebitsAndCredits,
    monthlyDebitCredit,
} from "../services/userService.js";

const router = express.Router();


router.get("/:id/messages", async (req, res) => {
    try {
        const userId = req.params.id; 
        const decryptedMessages = await getUserMessagesById(userId); // Messages are already decrypted

        if (decryptedMessages.length > 0) {
            res.status(200).send({
                message: "User messages retrieved successfully",
                data: decryptedMessages, // Send the decrypted messages
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
            console.log(messages)
            const totals = calculateTotalDebitsAndCredits(messages);
            console.log(totals);
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
})

router.get("/:id/messages/:month", async (req, res) => {
    try {
        const userId = req.params.id;        // Extract userId from route params
        const monthNumber = parseInt(req.params.month);  // Extract month from route params

        // Validate monthNumber
        if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
            return res.status(400).json({
                error: "Invalid month number. Please provide a month between 1 and 12.",
            });
        }

        // Fetch the user's messages by userId
        const messages = await getUserMessagesById(userId);

        // Calculate total debits and credits for the given month
        const monthlyTotals = monthlyDebitCredit(messages, monthNumber);

        res.status(200).json({
            message: "Monthly debits and credits calculated successfully",
            data: monthlyTotals,
        });
    } catch (error) {
        console.error("Error calculating monthly totals:", error);
        res.status(500).json({
            error: "Failed to calculate monthly debits and credits",
        });
    }
});



export default router;
