import "dotenv/config";
import * as Sentry from "@sentry/node";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

// Import your authentication routes
// NOTE: Make sure the file inside your 'routes' folder is named 'auth.ts' (or 'auth.js')
import authRoutes from "./routes/authRoutes"; 

// ==========================================
// 1. SENTRY INITIALIZATION (Must be first)
// ==========================================
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0, 
});

// ==========================================
// 2. LOGGER INITIALIZATION (Better Stack)
// ==========================================
const logtail = new Logtail(process.env.BETTER_STACK_TOKEN as string);
export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(), 
    new LogtailTransport(logtail)     
  ],
});

logger.info("TerraMind Backend initializing...");

// ==========================================
// 3. EXPRESS & MIDDLEWARE SETUP
// ==========================================
const app = express();
app.use(express.json());

// Apply the CORS policy linked to your Vercel frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// ==========================================
// 4. DATABASE CONNECTION
// ==========================================
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => logger.info("Connected to MongoDB Atlas successfully"))
  .catch((err) => logger.error("MongoDB connection error:", err));

// ==========================================
// 5. API ROUTES
// ==========================================
app.get('/api/v1/health', (req, res) => {
  logger.info("Health check endpoint pinged by frontend");
  res.json({ status: "ok", message: "TerraMind API Gateway is running" });
});

// ACTIVE ROUTES: This fixes the 404 error for registration and login
app.use('/api/v1/auth', authRoutes);

// Test endpoint to verify Sentry is receiving errors
app.get('/api/v1/debug-sentry', function mainHandler(req, res) {
  logger.error("Intentional Sentry error triggered for testing");
  throw new Error("My first Sentry error!");
});

// ==========================================
// 6. ERROR HANDLING (Must be after routes)
// ==========================================
Sentry.setupExpressErrorHandler(app);

// ==========================================
// 7. START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});