import express from "express";
import userRoutes from "./routes/userRoutes.js";
import monthlyLimitRoutes from "./routes/MonthlyLimit.route.js"; // Import the new route
import expenseRouter from "./routes/expense.router.js";
import inputRouter from "./routes/Input.router.js";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: "*",
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));


app.use("/api/addInput", inputRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/auth", userRoutes);
app.use("/api/monthly", monthlyLimitRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
});

export default app;
