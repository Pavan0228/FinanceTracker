import express from "express";
import {
    getUserMessages,
    getTotalDebitCredit,
    getMonthlyDebitCredit,
    getMonthlyMessages,
    getYearlyMessages,
    getAllMonthSummary
} from "../controllers/expense.controller.js";

const router = express.Router();

router.get("/:id/messages", getUserMessages);
router.get("/:id/total", getTotalDebitCredit);
router.get("/:id/monthlyDebitCredit/:month/:year", getMonthlyDebitCredit);
router.get("/:id/monthly/messages/:month/:year", getMonthlyMessages);
router.get("/:id/messages/:year", getYearlyMessages);
router.get('/allMonthSummary/:userId/:year', getAllMonthSummary);
//test get code
router.get('/test', (req, res) => {
    res.send('test route')
    });
    

export default router;