import pool from '../db';
import { ProfileData } from '@devpro/types';

export const generateProfile = async (userId: string): Promise<ProfileData> => {
  // 1. Fetch raw data from the database
  const profileRes = await pool.query('SELECT slug, template, is_public FROM profiles WHERE user_id = $1', [userId]);
  const githubRes = await pool.query('SELECT profile_json, repos_json, stats_json FROM github_data WHERE user_id = $1', [userId]);
  const leetcodeRes = await pool.query('SELECT stats_json FROM leetcode_data WHERE user_id = $1', [userId]);

  if (githubRes.rows.length === 0) {
    throw new Error('Cannot generate profile: GitHub data is missing. Please sync GitHub first.');
  }

  const dbProfile = profileRes.rows[0] || { slug: null, template: 'minimal', is_public: false };
  const github = githubRes.rows[0];
  const leetcode = leetcodeRes.rows.length > 0 ? leetcodeRes.rows[0].stats_json : null;

  // 2. Featured Projects Algorithm
  // - Filter out basic forks (we keep forks if they have > 5 stars, meaning they actually contributed)
  // - Sort by stars descending
  // - Take top 6
  let repos = github.repos_json || [];
  repos = repos.filter((repo: any) => !repo.fork || repo.stargazers_count > 5);
  repos.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count);
  
  const featuredProjects = repos.slice(0, 6).map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    html_url: repo.html_url,
    stargazers_count: repo.stargazers_count,
    language: repo.language
  }));

  // 3. Construct the ProfileData snapshot
  const profileData: ProfileData = {
    user: {
      name: github.profile_json?.name || github.profile_json?.login || null,
      bio: github.profile_json?.bio || null,
      avatar_url: github.profile_json?.avatar_url || null,
      location: github.profile_json?.location || null,
    },
    stats: {
      total_stars: github.stats_json?.total_stars || 0,
      followers: github.stats_json?.followers || 0,
      top_languages: github.stats_json?.top_languages || {},
    },
    featuredProjects,
    leetcode,
    metadata: {
      template: dbProfile.template,
      is_public: dbProfile.is_public,
      slug: dbProfile.slug,
      generated_at: new Date().toISOString(),
    }
  };

  // 4. Update the snapshot into the profiles table
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
