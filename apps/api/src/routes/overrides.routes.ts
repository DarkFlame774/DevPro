import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import pool from '../db';

const router = Router();

// GET all overrides for the user
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const result = await pool.query(
      'SELECT entity_type, entity_id, override_data FROM user_overrides WHERE user_id = $1',
      [userId]
    );
    res.json({ overrides: result.rows });
  } catch (err: any) {
    console.error('Error fetching overrides:', err);
    res.status(500).json({ error: 'Failed to fetch overrides' });
  }
});

// PUT (upsert) an override
router.put('/:entityType/:entityId', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { entityType, entityId } = req.params;
    const overrideData = req.body.override_data;

    if (!overrideData) {
      return res.status(400).json({ error: 'override_data is required in the body' });
    }

    const query = `
      INSERT INTO user_overrides (user_id, entity_type, entity_id, override_data, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (user_id, entity_type, entity_id) 
      DO UPDATE SET 
        override_data = EXCLUDED.override_data,
        updated_at = NOW()
      RETURNING *;
    `;
    
    const result = await pool.query(query, [userId, entityType, entityId, JSON.stringify(overrideData)]);
    res.json({ message: 'Override saved successfully', override: result.rows[0] });
  } catch (err: any) {
    console.error('Error saving override:', err);
    res.status(500).json({ error: 'Failed to save override' });
  }
});

// DELETE an override (reset to evidence)
router.delete('/:entityType/:entityId', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { entityType, entityId } = req.params;

    await pool.query(
      'DELETE FROM user_overrides WHERE user_id = $1 AND entity_type = $2 AND entity_id = $3',
      [userId, entityType, entityId]
    );

    res.json({ message: 'Override reset to evidence successfully' });
  } catch (err: any) {
    console.error('Error deleting override:', err);
    res.status(500).json({ error: 'Failed to delete override' });
  }
});

export default router;
