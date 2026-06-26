import { Router, Request, Response } from 'express';
import pool from '../db';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Consolidated dashboard status
router.get('/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Fetch user email
    const userRes = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);

    // Fetch platform connections
    const connectionsRes = await pool.query(
      'SELECT platform, platform_username, status, last_sync_at FROM platform_connections WHERE user_id = $1',
      [userId]
    );

    // Fetch profile settings
    const profileRes = await pool.query(
      'SELECT slug, template, accent_color, is_public, profile_data IS NOT NULL AS has_snapshot, updated_at FROM profiles WHERE user_id = $1',
      [userId]
    );

    // Build connections map
    const connections: Record<string, any> = {};
    connectionsRes.rows.forEach((row: any) => {
      connections[row.platform] = {
        username: row.platform_username,
        status: row.status,
        lastSyncAt: row.last_sync_at,
      };
    });

    const profile = profileRes.rows[0] || null;

    return res.status(200).json({
      email: userRes.rows[0]?.email || null,
      connections,
      profile: profile ? {
        slug: profile.slug,
        template: profile.template,
        accentColor: profile.accent_color || 'blue',
        isPublic: profile.is_public,
        hasSnapshot: profile.has_snapshot,
        updatedAt: profile.updated_at,
      } : null,
    });
  } catch (error) {
    console.error('Dashboard status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
