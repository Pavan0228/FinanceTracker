import {
    getUserDataById,
    getUserMessagesById,
    calculateTotalDebitsAndCredits,
    monthlyDebitCredit,
    getUserMonthlyMessagesById,
    getUserYearlyMessagesById,
} from "../services/userService.js";

export const getUserMessages = async (req, res) => {
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
        console.error("Error in getUserMessages:", error);
        res.status(500).send({ error: "Failed to retrieve user messages" });
    }
};

export const getTotalDebitCredit = async (req, res) => {
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
        console.error("Error in getTotalDebitCredit:", error);
        res.status(500).send({
            error: "Failed to calculate total debit and credit amounts",
        });
    }
};

export const getMonthlyDebitCredit = async (req, res) => {
    try {
        const userId = req.params.id;
        const monthNumber = parseInt(req.params.month);
        const year = parseInt(req.params.year);

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
        const monthlyTotals = monthlyDebitCredit(messages, monthNumber);

        res.status(200).json({
            message: "Monthly debits and credits calculated successfully",
            data: monthlyTotals,
        });
    } catch (error) {
        console.error("Error in getMonthlyDebitCredit:", error);
        res.status(500).json({
            error: "Failed to calculate monthly debits and credits",
        });
    }
};

export const getMonthlyMessages = async (req, res) => {
    const { id, month, year } = req.params;
    const monthYear = `${month.toString().padStart(2, "0")}${year}`;

    try {
        const monthlyMessages = await getUserMonthlyMessagesById(id, monthYear);
        res.status(200).json({
            message:"daily finance retrived ",
            monthlyMessages});
    } catch (error) {
        console.error("Error in getMonthlyMessages:", error);
        res.status(500).json({
            message: "Failed to retrieve monthly messages",
        });
    }
};

export const getYearlyMessages = async (req, res) => {
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
        console.error("Error in getYearlyMessages:", error);
        res.status(500).send({ error: "Failed to retrieve user messages" });
    }
};

export const getAllMonthSummary = async (req, res) => {
    const { userId, year } = req.params;

    try {
        const yearlyMessages = await getUserYearlyMessagesById(userId, year);
        const monthlyTotals = {};

        yearlyMessages.forEach((msg) => {
            const monthPart = msg.date.split("/")[1];
            const month = parseInt(monthPart, 10);

            if (!monthlyTotals[month]) {
                monthlyTotals[month] = { totalCredit: 0, totalDebit: 0 };
            }

            if (msg.type === "debited") {
                monthlyTotals[month].totalDebit += parseFloat(msg.amount);
            } else if (msg.type === "credited") {
                monthlyTotals[month].totalCredit += parseFloat(msg.amount);
            }
        });

        const financeSummary = Object.keys(monthlyTotals)
            .map((month) => ({
                month: parseInt(month),
                totalCredit: monthlyTotals[month].totalCredit,
                totalDebit: monthlyTotals[month].totalDebit,
            }))
            .filter(
                (summary) =>
                    summary.totalCredit !== 0 || summary.totalDebit !== 0
            );

        res.status(200).json(financeSummary);
    } catch (error) {
        console.error("Error in getAllMonthSummary:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
