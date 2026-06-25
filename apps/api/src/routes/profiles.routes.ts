import { Router, Request, Response } from 'express';
import pool from '../db';
import { requireAuth } from '../middleware/auth.middleware';
import { generateProfile } from '../services/profile.service';

const router = Router();

// 1. Generate Profile Snapshot
router.post('/generate', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const profileData = await generateProfile(userId);
    return res.status(200).json({ message: 'Profile generated successfully', profile: profileData });
  } catch (error: any) {
    console.error('Generate profile error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 2. Fetch Logged-in User's Profile
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const profileRes = await pool.query('SELECT slug, template, is_public, profile_data FROM profiles WHERE user_id = $1', [userId]);
    
    if (profileRes.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    let profileData = profileRes.rows[0].profile_data;

    // Read-Time Upgrade: Regenerate on the fly if schema is outdated
    if (profileData && (!profileData.metadata || profileData.metadata.schemaVersion !== 1)) {
      profileData = await generateProfile(userId);
    }

    return res.status(200).json({ 
      ...profileRes.rows[0], 
      profile_data: profileData, // keep backward compat for dashboard for now if it relies on this exact key
      evidence: profileData,
      themePreferences: {
        template: profileRes.rows[0].template,
        accentColor: profileRes.rows[0].accent_color
      }
    });
  } catch (error) {
    console.error('Fetch my profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Set Profile Settings (slug, visibility, template, accent color)
router.post('/settings', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { slug, isPublic, template, accentColor } = req.body;

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ error: 'Slug is required' });
    }

    const slugRegex = /^[a-zA-Z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return res.status(400).json({ error: 'Slug can only contain letters, numbers, and hyphens' });
    }

    const validTemplates = ['minimal', 'professional', 'terminal'];
    const selectedTemplate = validTemplates.includes(template) ? template : 'professional';

    const validAccents = ['blue', 'purple', 'emerald'];
    const selectedAccent = validAccents.includes(accentColor) ? accentColor : 'blue';

    await pool.query(`
      INSERT INTO profiles (user_id, slug, is_public, template, accent_color, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        slug = EXCLUDED.slug,
        is_public = EXCLUDED.is_public,
        template = EXCLUDED.template,
        accent_color = EXCLUDED.accent_color,
        updated_at = NOW();
    `, [userId, slug, isPublic === true, selectedTemplate, selectedAccent]);

    return res.status(200).json({ message: 'Profile settings updated' });
  } catch (error: any) {
    if (error.code === '23505') { 
      return res.status(400).json({ error: 'That slug is already taken' });
    }
    console.error('Profile settings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Fetch Public Profile Snapshot by Slug (Public Route)
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const profileRes = await pool.query(
      'SELECT user_id, is_public, template, accent_color, profile_data FROM profiles WHERE slug = $1',
      [slug]
    );

    if (profileRes.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = profileRes.rows[0];

    if (!profile.is_public) {
      return res.status(403).json({ error: 'This profile is private' });
    }

    if (!profile.profile_data) {
       return res.status(400).json({ error: 'This profile has not been generated yet.' });
    }

    let profileData = profile.profile_data;

    // Read-Time Upgrade: Regenerate on the fly if schema is outdated
    if (!profileData.metadata || profileData.metadata.schemaVersion !== 1) {
      profileData = await generateProfile(profile.user_id);
    }

    return res.status(200).json({
      evidence: profileData,
      themePreferences: {
        template: profile.template,
        accentColor: profile.accent_color
      }
    });
  } catch (error) {
    console.error('Fetch public profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
