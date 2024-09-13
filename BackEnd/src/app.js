import express from "express";
import userRoutes from "./routes/userRoutes.js";
import monthlyLimitRoutes from "./routes/MonthlyLimit.route.js"; // Import the new route
import expenseRouter from "./routes/expense.router.js"
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use the user routes
app.use("/api/fin", expenseRouter);
app.use("/api/auth", userRoutes);
// Use the monthly limit routes
app.use("/api/monthly-limit", monthlyLimitRoutes);

export default app;
