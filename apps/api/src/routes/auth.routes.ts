import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';
import { requireAuth } from '../middleware/auth.middleware';
import { SignupRequest, LoginRequest, User } from '@devpro/types';
import { exchangeCodeForToken, fetchGithubUser } from '../services/github.service';
import { encrypt } from '../utils/encryption';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate Limiting for Login & Signup attempts (to prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret_do_not_use_in_prod';

// Helper function to generate a JWT and set it as an HTTP-only cookie
const setTokenCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

router.post('/signup', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as SignupRequest;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Basic Input Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
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

router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Basic Input Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
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
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
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

// --- GITHUB OAUTH ROUTES ---

// 1. Redirect to GitHub
router.get('/github', (req: Request, res: Response) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const baseUrl = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL || 'http://localhost:3001';
  const redirectUri = `${baseUrl}/api/auth/github/callback`;
  // We request 'read:user' to get their profile, and 'user:email' to get their email address.
  const scope = 'read:user user:email';
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  res.redirect(githubAuthUrl);
});

// 2. Handle the Callback from GitHub
router.get('/github/callback', async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'No code provided by GitHub' });
  }

  try {
    // Exchange code for access token
    const accessToken = await exchangeCodeForToken(code);
    if (!accessToken) {
      return res.status(401).json({ error: 'Failed to exchange code for access token' });
    }

    // Fetch user details
    const githubUser = await fetchGithubUser(accessToken);
    if (!githubUser || !githubUser.email) {
      return res.status(400).json({ error: 'Failed to fetch GitHub profile or email' });
    }

    // Find or Create the user
    let userId: string;
    const existingUserRes = await pool.query('SELECT id FROM users WHERE email = $1', [githubUser.email]);

    if (existingUserRes.rows.length > 0) {
      // User exists!
      userId = existingUserRes.rows[0].id;
    } else {
      // Create new user (notice password_hash is NULL because they are an OAuth user)
      const newUserRes = await pool.query(
        'INSERT INTO users (email) VALUES ($1) RETURNING id',
        [githubUser.email]
      );
      userId = newUserRes.rows[0].id;
    }

    const encryptedToken = encrypt(accessToken);

    // Upsert the platform connection so we save the Access Token for later API calls
    await pool.query(`
      INSERT INTO platform_connections (user_id, platform, platform_username, access_token, status)
      VALUES ($1, 'github', $2, $3, 'connected')
      ON CONFLICT (user_id, platform) 
      DO UPDATE SET 
        platform_username = EXCLUDED.platform_username,
        access_token = EXCLUDED.access_token,
        status = 'connected',
        last_sync_at = NOW();
    `, [userId, githubUser.username, encryptedToken]);

    // Set our own JWT session cookie
    setTokenCookie(res, userId);

    // Redirect the user back to the frontend dashboard!
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/dashboard`);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
});

export default router;
