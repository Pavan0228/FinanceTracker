// routes/user.router.js
import express from "express";
import {
    getUserDataById,
    getUserMessagesById,
    calculateTotalDebitsAndCredits,
    monthlyDebitCredit,
    getUserMonthlyMessagesById,
    getUserYearlyMessagesById,
    // debugGetUserYearlyMessagesById,
} from "../services/userService.js";

const router = express.Router();

router.get("/:id/messages", async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);
        const decryptedMessages = await getUserMessagesById(userId);

        if (decryptedMessages.length > 0) {
            res.status(200).send({
                message: "User messages retrieved successfully",
                data: decryptedMessages,
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

router.get("/:id/monthlyDebitCredit/:month/:year", async (req, res) => {
    try {
        const userId = req.params.id; // Extract userId from route params
        const monthNumber = parseInt(req.params.month); // Extract month from route params
        const year = parseInt(req.params.year); // Extract year from route params

        // Validate monthNumber and year
        if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
            return res.status(400).json({
                error: "Invalid month number. Please provide a month between 1 and 12.",
            });
        }
        if (isNaN(year) || year < 2000 || year > new Date().getFullYear()) {
            return res.status(400).json({
                error: "Invalid year. Please provide a valid year.",
            });
        }

        const monthYear = `${monthNumber.toString().padStart(2, "0")}${year}`;

        const messages = await getUserMonthlyMessagesById(userId, monthYear);

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

router.get("/:id/monthly/messages/:month/:year", async (req, res) => {
    const { id, month, year } = req.params;

    const monthYear = `${month.toString().padStart(2, "0")}${year}`;

    try {
        const monthlyMessages = await getUserMonthlyMessagesById(id, monthYear);
        res.status(200).json(monthlyMessages);
    } catch (error) {
        console.error("Error retrieving monthly messages:", error);
        res.status(500).json({
            message: "Failed to retrieve monthly messages",
        });
    }
});

router.get("/:id/messages/:year", async (req, res) => {
    try {
        const { id, year } = req.params;
        const decryptedMessages = await getUserYearlyMessagesById(id, year);

        if (decryptedMessages.length > 0) {
            res.status(200).send({
                message: "User messages retrieved successfully",
                data: decryptedMessages,
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
    


router.get('/allMonthSummary/:userId/:year', async (req, res) => {
    const { userId, year } = req.params;

    try {
        // Fetch all messages for the specified year
        const yearlyMessages = await getUserYearlyMessagesById(userId, year);
        const monthlyTotals = {};
        // console.log(yearlyMessages)

        // Aggregate totals
        yearlyMessages.forEach((msg) => {
            const msgDate = msg.date;
            // console.log(msgDate)
            //split after DD/ till /YYYY
            const monthPart = msgDate.split('/')[1];  // Extract the month part after DD/
            const month = parseInt(monthPart, 10);  // Convert to integer
            // console.log(month)
            if (!monthlyTotals[month]) {
                monthlyTotals[month] = { totalCredit: 0, totalDebit: 0 };
            }

            // Aggregate debit and credit amounts based on the transaction type
            if (msg.type === "Debited") {
                monthlyTotals[month].totalDebit += parseFloat(msg.amount);
            } else if (msg.type === "Credited") {
                monthlyTotals[month].totalCredit += parseFloat(msg.amount);
            }
        });

        // Convert to array format, filter out months with no data (i.e., totalCredit and totalDebit are 0)
        const financeSummary = Object.keys(monthlyTotals).map((month) => ({
            month: parseInt(month),
            totalCredit: monthlyTotals[month].totalCredit,
            totalDebit: monthlyTotals[month].totalDebit,
        })).filter((summary) => summary.totalCredit !== 0 || summary.totalDebit !== 0);

        res.status(200).json(financeSummary);
    } catch (error) {
        console.error('Error fetching finance summary:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
