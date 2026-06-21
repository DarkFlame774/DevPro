import { Router, Request, Response } from 'express';
import pool from '../db';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// 1. Set Profile Settings (slug, visibility)
router.post('/settings', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { slug, isPublic } = req.body;

    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }

    // Upsert profile settings
    await pool.query(`
      INSERT INTO profiles (user_id, slug, is_public, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        slug = EXCLUDED.slug,
        is_public = EXCLUDED.is_public,
        updated_at = NOW();
    `, [userId, slug, isPublic === true]);

    return res.status(200).json({ message: 'Profile settings updated' });
  } catch (error: any) {
    if (error.code === '23505') { // Unique constraint violation in Postgres
      return res.status(400).json({ error: 'That slug is already taken' });
    }
    console.error('Profile settings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Fetch Public Profile by Slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // Fetch the profile
    const profileRes = await pool.query(
      'SELECT user_id, template, is_public FROM profiles WHERE slug = $1',
      [slug]
    );

    if (profileRes.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = profileRes.rows[0];

    if (!profile.is_public) {
      return res.status(403).json({ error: 'This profile is private' });
    }

    const userId = profile.user_id;

    // Fetch GitHub data
    const githubRes = await pool.query(
      'SELECT profile_json, repos_json, stats_json FROM github_data WHERE user_id = $1',
      [userId]
    );
    
    // Fetch LeetCode data
    const leetcodeRes = await pool.query(
      'SELECT stats_json FROM leetcode_data WHERE user_id = $1',
      [userId]
    );

    // Build the public DTO
    const publicProfile = {
      template: profile.template,
      github: githubRes.rows.length > 0 ? githubRes.rows[0] : null,
      leetcode: leetcodeRes.rows.length > 0 ? leetcodeRes.rows[0] : null,
    };

    return res.status(200).json(publicProfile);
  } catch (error) {
    console.error('Fetch public profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
