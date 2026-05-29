import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { createProxyMiddleware } from "http-proxy-middleware";

import authMiddleware from "./middleware/authMiddleware.js";

const app = express();

app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL_LIST
        ],
        credentials: true,
        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Authorization",
            "Content-Type"
        ]
    })
);
const apiLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW),
    max: Number(process.env.RATE_LIMIT),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later."
    }
});

app.use(apiLimiter);
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
app.use(
    "/location",
    createProxyMiddleware({
        target: process.env.BACKEND_SERVICE_URL,
        changeOrigin: true
    })
);
app.use(
    "/group",
    createProxyMiddleware({
        target: process.env.BACKEND_SERVICE_URL,
        changeOrigin: true
    })
);
app.use(
    "/user",
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

