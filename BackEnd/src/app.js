import express from "express";
import userRoutes from "./routes/userRoutes.js";
import monthlyLimitRoutes from "./routes/MonthlyLimit.route.js"; // Import the new route

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use the user routes
app.use("/api/user", userRoutes);

// Use the monthly limit routes
app.use("/api/monthly-limit", monthlyLimitRoutes);

export default app;
