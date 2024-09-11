import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use the user routes
app.use("/api/user", userRoutes);

export default app;
