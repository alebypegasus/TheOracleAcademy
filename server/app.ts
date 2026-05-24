import express from "express";
import apiRouter from "./routes";
import { securityMiddleware } from "./middlewares/security.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

// 1. Core Middlewares
app.use(express.json());

// 2. Custom Security Middleware (XSS, Injection Heuristics, headers)
app.use(securityMiddleware);

// 3. API Routes
app.use("/api", apiRouter);

// 4. Global Error Catcher
app.use(errorMiddleware);

export default app;
