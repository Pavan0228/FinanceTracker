import express from "express";
import userRoutes from "./routes/userRoutes.js";
import monthlyLimitRoutes from "./routes/MonthlyLimit.route.js"; // Import the new route
import expenseRouter from "./routes/expense.router.js";
import inputRouter from "./routes/Input.router.js";
import imageRouter from "./routes/ImageUpload.routes.js"
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(
    cors({
        origin: "*",
    })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
const buildPath = path.join(__dirname, "../../FrontEnd/dist");
app.use(express.static(buildPath));


app.use("/api/addInput", inputRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/auth", userRoutes);
app.use("/api/monthly", monthlyLimitRoutes);
app.use("/api/upload",imageRouter)


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/*", function (req, res) {
    res.sendFile(
        path.join(__dirname, "../FrontEnd/dist/index.html"),
        function (err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});

export default app;
