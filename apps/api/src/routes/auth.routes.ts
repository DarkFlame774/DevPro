import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';
import { requireAuth } from '../middleware/auth.middleware';
import { SignupRequest, LoginRequest, User } from '@devpro/types';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret_do_not_use_in_prod';

// Helper function to generate a JWT and set it as an HTTP-only cookie
const setTokenCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as SignupRequest;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const newUserResult = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, passwordHash]
    );

    const user: User = newUserResult.rows[0];

    // Set session cookie
    setTokenCookie(res, user.id);

    return res.status(201).json({ message: 'Signup successful', user });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const userResult = await pool.query('SELECT id, email, password_hash, created_at FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userRecord = userResult.rows[0];

    // Verify password if they have one (OAuth users might not)
    if (!userRecord.password_hash) {
      return res.status(401).json({ error: 'Please login with your connected provider (e.g., GitHub)' });
    }

    const isMatch = await bcrypt.compare(password, userRecord.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Prepare user object to return
    const user: User = {
      id: userRecord.id,
      email: userRecord.email,
      created_at: userRecord.created_at,
    };

    // Set session cookie
    setTokenCookie(res, user.id);

    return res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
});

// Protected route to get the currently logged-in user
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userResult = await pool.query('SELECT id, email, created_at FROM users WHERE id = $1', [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user: User = userResult.rows[0];
    return res.status(200).json({ user });
  } catch (error) {
    console.error('/me error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
