import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { HealthStatus } from '@devpro/types';
import authRoutes from './routes/auth.routes';
import syncRoutes from './routes/sync.routes';
import connectionsRoutes from './routes/connections.routes';
import profilesRoutes from './routes/profiles.routes';
import dashboardRoutes from './routes/dashboard.routes';
import rateLimit from 'express-rate-limit';

// Ensure dotenv is loaded pointing to correct .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Startup Environment Validation
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`[FATAL] Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration to allow frontend to access the API and send cookies
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Mount our routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/health', (req: Request, res: Response) => {
  const status: HealthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString()
  };
  res.json(status);
});

app.listen(port, () => {
  console.log(`[API] Server is running on http://localhost:${port}`);
});
