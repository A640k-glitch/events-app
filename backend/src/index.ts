import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { eventsRouter } from "./routes/events.routes.js";
import { leadsRouter } from "./routes/leads.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Middleware
app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    service: "FifthLab Events Backend API",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/events", eventsRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 FifthLab Events Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Connected for Abraham Akinwole & Team`);
});

export default app;
