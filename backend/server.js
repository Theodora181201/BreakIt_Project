import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import generateMindMap from "./routes/generateMindMap.js";

// Prevent AI endpoint spam
import { limiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// -------------------------
// Middleware
// -------------------------

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

app.use(express.json());

app.use(limiter);

// -------------------------
// Routes
// -------------------------

app.use(
    "/api",
    generateMindMap
);

// -------------------------
// Test route
// -------------------------

app.get("/", (req, res) => {

    res.json({
        message: "Break It. backend is running!"
    });

});

// -------------------------
// Start server
// -------------------------

app.listen(PORT, () => {

    console.log(
        `🚀 Server running on http://localhost:${PORT}`
    );

});