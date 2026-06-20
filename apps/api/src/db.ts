import { Pool } from 'pg';
import dotenv from 'dotenv';

// Ensure dotenv is loaded
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
