import express from "express";
import userRoutes from "./routes/userRoutes.js";
import monthlyLimitRoutes from "./routes/MonthlyLimit.route.js"; // Import the new route
import expenseRouter from "./routes/expense.router.js";
import inputRouter from "./routes/Input.router.js";
import imageRouter from "./routes/ImageUpload.routes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            // If CORS_ORIGIN is set, use it; otherwise allow all origins
            const allowedOrigins = process.env.CORS_ORIGIN
                ? process.env.CORS_ORIGIN.split(",")
                : ["*"];

            if (
                allowedOrigins.includes("*") ||
                allowedOrigins.indexOf(origin) !== -1
            ) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers",
        ],
        exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],
        preflightContinue: false,
        optionsSuccessStatus: 200,
    })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Handle preflight requests explicitly
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type,Authorization,X-Requested-With,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
});

const buildPath = path.join(__dirname, "../../FrontEnd/dist");
app.use(express.static(buildPath));


app.use("/api/addInput", inputRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/auth", userRoutes);
app.use("/api/monthly", monthlyLimitRoutes);
app.use("/api/upload", imageRouter);

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
