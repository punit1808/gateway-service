import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { createProxyMiddleware } from "http-proxy-middleware";

import authMiddleware from "./middleware/authMiddleware.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());

/*
|--------------------------------------------------------------------------
| JWT AUTH MIDDLEWARE
|--------------------------------------------------------------------------
*/

app.use(authMiddleware);

/*
|--------------------------------------------------------------------------
| AUTH SERVICE ROUTES
|--------------------------------------------------------------------------
*/

app.use(
    "/auth",
    createProxyMiddleware({
        target: process.env.AUTH_SERVICE_URL,
        changeOrigin: true
    })
);

/*
|--------------------------------------------------------------------------
| BUSINESS SERVICE ROUTES
|--------------------------------------------------------------------------
*/

app.use(
    "/api",
    createProxyMiddleware({
        target: process.env.BACKEND_SERVICE_URL,
        changeOrigin: true
    })
);

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/health", (req, res) => {
    res.json({
        status: "Gateway running"
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Gateway running on port ${PORT}`);
});

