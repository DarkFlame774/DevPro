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

// Ensure dotenv is loaded pointing to correct .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration to allow frontend to access the API and send cookies
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Mount our routes
app.use('/api/auth', authRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/profiles', profilesRoutes);

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
