// backend/src/server.ts
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ service: 'terramind-node-api', status: 'operational', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[Node API] Server running on http://localhost:${PORT}`);
});