import client from "../../client.js";
import {
    getUserDataById,
    getUserMessagesById,
    calculateTotalDebitsAndCredits,
    monthlyDebitCredit,
    getUserMonthlyMessagesById,
    getUserYearlyMessagesById,
} from "../services/userService.js";

const redisHelper = {
    async get(key) {
        try {
            const data = await client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Redis GET Error:', error);
            return null;
        }
    },
    async set(key, value, expires) {
        try {
            await client.set(key, JSON.stringify(value), {
                EX: expires // expiration in seconds
            });
        } catch (error) {
            console.error('Redis SET Error:', error);
        }
    }
};

export const getUserMessages = async (req, res) => {
    try {
        const userId = req.params.id;
        const cachedMessages = await redisHelper.get(`messages:${userId}`);
        if (cachedMessages) {
            return res.status(200).send({
                message: "User messages retrieved successfully",
                data: cachedMessages,
            });
        }

        const decryptedMessages = await getUserMessagesById(userId);
        
        if (decryptedMessages.length > 0) {
            await redisHelper.set(`messages:${userId}`, decryptedMessages, 60);
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
        const cachedTotals = await redisHelper.get(`totals:${userId}`);
        if (cachedTotals) {
            return res.status(200).send({
                message: "Total debit and credit amounts retrieved successfully",
                totalDebit: cachedTotals.totalDebit,
                totalCredit: cachedTotals.totalCredit,
            });
        }

        const messages = await getUserMessagesById(userId);
        if (messages) {
            const totals = calculateTotalDebitsAndCredits(messages);
            await redisHelper.set(`totals:${userId}`, totals, 60);
            res.status(200).send({
                message: "Total debit and credit amounts retrieved successfully",
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

        const cacheKey = `monthly:${userId}:${monthNumber}:${year}`;
        const cachedData = await redisHelper.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                message: "Monthly debits and credits calculated successfully",
                data: cachedData,
            });
        }

        const monthYear = `${monthNumber.toString().padStart(2, "0")}${year}`;
        const messages = await getUserMonthlyMessagesById(userId, monthYear);
        const monthlyTotals = monthlyDebitCredit(messages, monthNumber);

        await redisHelper.set(cacheKey, monthlyTotals, 60);

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
        const cacheKey = `monthlyMessages:${id}:${monthYear}`;
        const cachedMessages = await redisHelper.get(cacheKey);
        if (cachedMessages) {
            return res.status(200).json({
                message: "daily finance retrieved",
                monthlyMessages: cachedMessages,
            });
        }

        const monthlyMessages = await getUserMonthlyMessagesById(id, monthYear);
        await redisHelper.set(cacheKey, monthlyMessages, 60);

        res.status(200).json({
            message:"daily finance retrieved ",
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
        const cacheKey = `yearlyMessages:${id}:${year}`;
        const cachedMessages = await redisHelper.get(cacheKey);
        if (cachedMessages) {
            return res.status(200).send({
                message: "User messages retrieved successfully",
                data: cachedMessages,
            });
        }

        const decryptedMessages = await getUserYearlyMessagesById(id, year);

        if (decryptedMessages.length > 0) {
            await redisHelper.set(cacheKey, decryptedMessages, 60);
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
        const cacheKey = `monthSummary:${userId}:${year}`;
        const cachedSummary = await redisHelper.get(cacheKey);
        if (cachedSummary) {
            return res.status(200).json(cachedSummary);
        }

        const yearlyMessages = await getUserYearlyMessagesById(userId, year);
        const monthlyTotals = {};

        yearlyMessages.forEach((msg) => {
            const monthPart = msg.date.split("/")[1];
            const month = parseInt(monthPart, 10);

            if (!monthlyTotals[month]) {
                monthlyTotals[month] = { totalCredit: 0, totalDebit: 0 };
            }

            if (msg.type === "Debited") {
                monthlyTotals[month].totalDebit += parseFloat(msg.amount);
            } else if (msg.type === "Credited") {
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

        await redisHelper.set(cacheKey, financeSummary, 60);
        res.status(200).json(financeSummary);
    } catch (error) {
        console.error("Error in getAllMonthSummary:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
