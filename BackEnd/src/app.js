import express from "express";
import userRoutes from "./routes/userRoutes.js";
import monthlyLimitRoutes from "./routes/MonthlyLimit.route.js"; // Import the new route
import expenseRouter from "./routes/expense.router.js"
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api/expense", expenseRouter);
app.use("/api/auth", userRoutes);
app.use("/api/monthly", monthlyLimitRoutes);

export default app;
