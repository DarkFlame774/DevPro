import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { HealthStatus } from '@devpro/types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

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
