import { Router, Request, Response } from 'express';
import pool from '../db';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// GET all raw projects (with current overrides merged)
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    
    // 1. Fetch raw platform data
    const platformRes = await pool.query('SELECT platform, raw_json FROM raw_platform_data WHERE user_id = $1', [userId]);
    let allProjects: any[] = [];
    
    for (const row of platformRes.rows) {
      if (row.platform === 'github') {
        const repos = row.raw_json.repos || [];
        repos.forEach((repo: any) => {
          allProjects.push({
            id: `gh-${repo.id}`,
            title: repo.name,
            description: repo.description,
            url: repo.html_url || repo.url,
            tags: repo.topics || [],
            evidence: [
              { label: 'Stars', value: repo.stargazers_count || 0, sourcePlatform: 'github', source: 'evidence' },
              { label: 'Forks', value: repo.forks_count || 0, sourcePlatform: 'github', source: 'evidence' }
            ]
          });
        });
      }
    }

    // 2. Fetch overrides
    const overridesRes = await pool.query('SELECT entity_id, override_data FROM user_overrides WHERE user_id = $1 AND entity_type = $2', [userId, 'project']);
    const overrides = new Map<string, any>();
    overridesRes.rows.forEach(row => overrides.set(row.entity_id, row.override_data));

    // 3. Merge overrides
    const mergedProjects = allProjects.map(project => {
      const override = overrides.get(project.id);
      return {
        ...project,
        originalTitle: project.title,
        originalDescription: project.description,
        title: override?.title || project.title,
        description: override?.description || project.description,
        isHidden: override?.isHidden || false,
        titleSource: override?.title ? 'override' : 'evidence',
        descriptionSource: override?.description ? 'override' : 'evidence',
      };
    });

    // Sort by stars descending
    mergedProjects.sort((a, b) => {
      const aStars = a.evidence.find((e: any) => e.label === 'Stars')?.value as number || 0;
      const bStars = b.evidence.find((e: any) => e.label === 'Stars')?.value as number || 0;
      return bStars - aStars;
    });

    res.json({ projects: mergedProjects });
  } catch (err: any) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

export default router;
