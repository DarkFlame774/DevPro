import pool from '../db';
import { CanonicalProfile, CanonicalProject, CanonicalLanguage, DeveloperSignal, Evidence } from '@devpro/types';

export const generateProfile = async (userId: string): Promise<CanonicalProfile> => {
  // 1. Fetch raw data from the database
  const profileRes = await pool.query('SELECT slug, template, accent_color, is_public FROM profiles WHERE user_id = $1', [userId]);
  const rawDataRes = await pool.query('SELECT platform, raw_json FROM raw_platform_data WHERE user_id = $1', [userId]);

  const dbProfile = profileRes.rows[0] || { slug: null, template: 'professional', accent_color: 'blue', is_public: false };
  
  let github: any = null;
  let leetcode: any = null;

  rawDataRes.rows.forEach(row => {
    if (row.platform === 'github') github = row.raw_json;
    if (row.platform === 'leetcode') leetcode = row.raw_json;
  });

  if (!github) {
    throw new Error('Cannot generate profile: GitHub data is missing. Please sync GitHub first.');
  }

  // 2. Identity
  const identity = {
    name: github.profile?.name || github.profile?.login || null,
    avatarUrl: github.profile?.avatar_url || null,
    headline: null, // User override only
    bio: github.profile?.bio || null,
    location: github.profile?.location || null,
  };

  // 3. Activity
  const activitySummary: Evidence[] = [];
  if (github.stats?.total_stars !== undefined) {
    activitySummary.push({ label: 'Total Stars', value: github.stats.total_stars, sourcePlatform: 'github' });
  }
  if (leetcode?.stats?.submitStats?.acSubmissionNum?.[0]?.count) {
    activitySummary.push({ label: 'Total Problems Solved', value: leetcode.stats.submitStats.acSubmissionNum[0].count, sourcePlatform: 'leetcode' });
  }

  // 4. Projects
  let repos = github.repos || [];
  repos = repos.filter((repo: any) => !repo.fork || repo.stargazers_count > 5);
  repos.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count);
  
  const projects: CanonicalProject[] = repos.slice(0, 6).map((repo: any) => ({
    id: `gh-${repo.id}`,
    title: repo.name,
    description: repo.description,
    url: repo.html_url,
    evidence: [
      { label: 'Stars', value: repo.stargazers_count, sourcePlatform: 'github' },
      ...(repo.language ? [{ label: 'Primary Language', value: repo.language, sourcePlatform: 'github' }] : [])
    ]
  }));

  // 5. Technical Focus (Languages)
  const languages: CanonicalLanguage[] = [];
  if (github.stats?.top_languages) {
    Object.entries(github.stats.top_languages).forEach(([lang, count]) => {
      languages.push({
        name: lang,
        evidence: [{ label: 'Repositories', value: count as number, sourcePlatform: 'github' }]
      });
    });
    // Sort by count descending
    languages.sort((a, b) => (b.evidence[0].value as number) - (a.evidence[0].value as number));
  }

  // 6. Developer Signals
  const developerSignals: DeveloperSignal[] = [];
  if (leetcode?.stats?.profile?.ranking) {
    developerSignals.push({
      observations: ['Active Problem Solver'],
      evidence: [
        { label: 'Global Rank', value: leetcode.stats.profile.ranking, sourcePlatform: 'leetcode' }
      ]
    });
  }

  // 7. Construct the CanonicalProfile snapshot
  const profileData: CanonicalProfile = {
    metadata: {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      template: dbProfile.template,
      accentColor: dbProfile.accent_color || 'blue',
      isPublic: dbProfile.is_public,
      slug: dbProfile.slug,
    },
    identity,
    activity: {
      lastActive: null,
      contributionSummary: activitySummary,
    },
    projects,
    technicalFocus: {
      languages: languages.slice(0, 6), // Top 6 languages
      technologies: []
    },
    developerSignals
  };

  // 8. Update the snapshot into the profiles table
  if (profileRes.rows.length === 0) {
    throw new Error('Please set and save your Public URL (Slug) in the Profile Settings before generating a snapshot.');
  }

  await pool.query(`
    UPDATE profiles 
    SET profile_data = $1, updated_at = NOW()
    WHERE user_id = $2
  `, [JSON.stringify(profileData), userId]);

  return profileData;
};
