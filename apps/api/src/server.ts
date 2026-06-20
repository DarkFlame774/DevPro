import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { HealthStatus } from '@devpro/types';
import authRoutes from './routes/auth.routes';

// Ensure dotenv is loaded pointing to correct .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration to allow frontend to access the API and send cookies
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Mount our new Authentication routes
app.use('/api/auth', authRoutes);

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
