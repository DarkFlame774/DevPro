import pool from '../db';
import { decrypt } from '../utils/encryption';

export const syncGitHubData = async (userId: string) => {
  // 1. Get the access token from the database
  const connectionRes = await pool.query(
    "SELECT access_token FROM platform_connections WHERE user_id = $1 AND platform = 'github'",
    [userId]
  );

  if (connectionRes.rows.length === 0 || !connectionRes.rows[0].access_token) {
    throw new Error('GitHub account not connected');
  }

  const token = decrypt(connectionRes.rows[0].access_token);
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
  };

  // 2. Fetch the user's public profile
  const profileRes = await fetch('https://api.github.com/user', { headers });
  if (!profileRes.ok) throw new Error('Failed to fetch GitHub profile');
  const profileJson = await profileRes.json();

  // 3. Fetch the user's public repositories (limit 100 for MVP, sorting by updated)
  const reposRes = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100&type=public', { headers });
  if (!reposRes.ok) throw new Error('Failed to fetch GitHub repositories');
  const reposJson = await reposRes.json();

  // 4. Calculate some basic stats (e.g., total stars, top languages)
  let totalStars = 0;
  const languages: Record<string, number> = {};

  reposJson.forEach((repo: any) => {
    totalStars += repo.stargazers_count;
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });

  const statsJson = {
    total_stars: totalStars,
    top_languages: languages,
    public_repos: profileJson.public_repos,
    followers: profileJson.followers,
  };

  // 5. Upsert into raw_platform_data table
  const rawJson = { profile: profileJson, repos: reposJson, stats: statsJson };
  await pool.query(`
    INSERT INTO raw_platform_data (user_id, platform, raw_json, updated_at)
    VALUES ($1, 'github', $2, NOW())
    ON CONFLICT (user_id, platform) 
    DO UPDATE SET 
      raw_json = EXCLUDED.raw_json,
      updated_at = NOW();
  `, [userId, JSON.stringify(rawJson)]);

  return { message: 'GitHub data synchronized successfully', stats: statsJson };
};

export const syncLeetCodeData = async (userId: string) => {
  // 1. Get the LeetCode username from the database
  const connectionRes = await pool.query(
    "SELECT platform_username FROM platform_connections WHERE user_id = $1 AND platform = 'leetcode'",
    [userId]
  );

  if (connectionRes.rows.length === 0 || !connectionRes.rows[0].platform_username) {
    throw new Error('LeetCode username not connected');
  }

  const username = connectionRes.rows[0].platform_username;

  // 2. Fetch data using LeetCode's public GraphQL API
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
          reputation
        }
      }
    }
  `;

  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Some simple User-Agent is sometimes required by LeetCode's WAF
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
    body: JSON.stringify({
      query,
      variables: { username }
    }),
  });

  if (!response.ok) throw new Error('Failed to fetch from LeetCode');
  
  const result = await response.json();
  
  if (result.errors || !result.data || !result.data.matchedUser) {
    throw new Error('Invalid LeetCode username or profile is private');
  }

  const statsJson = result.data.matchedUser;

  // 3. Upsert into raw_platform_data table
  const rawJson = { stats: statsJson };
  await pool.query(`
    INSERT INTO raw_platform_data (user_id, platform, raw_json, updated_at)
    VALUES ($1, 'leetcode', $2, NOW())
    ON CONFLICT (user_id, platform) 
    DO UPDATE SET 
      raw_json = EXCLUDED.raw_json,
      updated_at = NOW();
  `, [userId, JSON.stringify(rawJson)]);

  return { message: 'LeetCode data synchronized successfully', stats: statsJson };
};
