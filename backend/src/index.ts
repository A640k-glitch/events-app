import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { eventsRouter } from "./routes/events.routes.js";
import { registrationRouter } from "./routes/registration.routes.js";
import { pitchRouter } from "./routes/pitch.routes.js";
import { leadsRouter } from "./routes/leads.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { statsRouter } from "./routes/stats.routes.js";
import { newsletterRouter } from "./routes/newsletter.routes.js";
import { realtimeRouter } from "./routes/realtime.routes.js";
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
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check
app.get(["/api/health", "/health"], (_req, res) => {
  res.json({
    status: "healthy",
    service: "FifthLab Events Platform API",
    database: "Neon PostgreSQL",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/events", eventsRouter);
app.use("/events", eventsRouter);

app.use("/api/events", registrationRouter);
app.use("/events", registrationRouter);

app.use("/api/pitches", pitchRouter);
app.use("/pitches", pitchRouter);

app.use("/api/leads", leadsRouter);
app.use("/leads", leadsRouter);

app.use("/api/products", productsRouter);
app.use("/products", productsRouter);

app.use("/api/auth", authRouter);
app.use("/auth", authRouter);

app.use("/api/stats", statsRouter);
app.use("/stats", statsRouter);

app.use("/api/newsletter", newsletterRouter);
app.use("/newsletter", newsletterRouter);

app.use("/api/realtime", realtimeRouter);
app.use("/realtime", realtimeRouter);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 FifthLab Events API Server running on port ${PORT}`);
});

export default app;
