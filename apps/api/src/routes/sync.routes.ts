import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { syncGitHubData, syncLeetCodeData } from '../services/sync.service';

const router = Router();

// Trigger GitHub Sync
router.post('/github', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const result = await syncGitHubData(userId);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('GitHub Sync Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to sync GitHub data' });
  }
});

// Trigger LeetCode Sync
router.post('/leetcode', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const result = await syncLeetCodeData(userId);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('LeetCode Sync Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to sync LeetCode data' });
  }
});

export default router;
