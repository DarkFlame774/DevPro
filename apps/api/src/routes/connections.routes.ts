import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import pool from '../db';

const router = Router();

// Link LeetCode account
router.post('/leetcode', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { username } = req.body;

    if (!username || typeof username !== 'string' || username.trim() === '') {
      return res.status(400).json({ error: 'LeetCode username is required and must be a valid string' });
    }

    // Upsert the platform connection
    await pool.query(`
      INSERT INTO platform_connections (user_id, platform, platform_username, status)
      VALUES ($1, 'leetcode', $2, 'connected')
      ON CONFLICT (user_id, platform) 
      DO UPDATE SET 
        platform_username = EXCLUDED.platform_username,
        status = 'connected',
        last_sync_at = NOW();
    `, [userId, username]);

    return res.status(200).json({ message: 'LeetCode account linked successfully' });
  } catch (error: any) {
    console.error('LeetCode Linking Error:', error);
    return res.status(500).json({ error: 'Failed to link LeetCode account' });
  }
});

export default router;
