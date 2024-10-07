// src/index.js
import app from "./app.js";
import dotenv from "dotenv";

// Start the server

dotenv.config({
    path: './.env'
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
