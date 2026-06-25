import pool from '../db';
import { CanonicalProfile, CanonicalProject, CanonicalLanguage, DeveloperSignal, Evidence } from '@devpro/types';
import { EvidenceProvider, PartialIdentity } from './providers/types';
import { GithubProvider } from './providers/github.provider';
import { LeetCodeProvider } from './providers/leetcode.provider';

const providers: EvidenceProvider[] = [
  new GithubProvider(),
  new LeetCodeProvider()
];

export const generateProfile = async (userId: string): Promise<CanonicalProfile> => {
  // 1. Fetch raw data from the database
  const profileRes = await pool.query('SELECT slug, template, accent_color, is_public FROM profiles WHERE user_id = $1', [userId]);
  const rawDataRes = await pool.query('SELECT platform, raw_json FROM raw_platform_data WHERE user_id = $1', [userId]);
  
  // Create user_overrides if it doesn't exist to prevent crash? Actually the schema exists.
  const overridesRes = await pool.query('SELECT entity_type, entity_id, override_data FROM user_overrides WHERE user_id = $1', [userId]);

  const dbProfile = profileRes.rows[0] || { slug: null, template: 'professional', accent_color: 'blue', is_public: false };
  
  if (rawDataRes.rows.length === 0) {
    throw new Error('NoEvidenceSourceError: Please connect at least one platform to generate your profile.');
  }

  // Map platform data and overrides
  const platformData = new Map<string, any>();
  rawDataRes.rows.forEach(row => platformData.set(row.platform, row.raw_json));

  const overrides = new Map<string, any>();
  overridesRes.rows.forEach(row => overrides.set(`${row.entity_type}:${row.entity_id}`, row.override_data));

  // --- EXTRACTION LAYER ---
  const extractedIdentities: PartialIdentity[] = [];
  let globalLastActive: string | null = null;
  const allActivity: Evidence[] = [];
  const allProjects: CanonicalProject[] = [];
  const allLanguages: CanonicalLanguage[] = [];
  const allSignals: DeveloperSignal[] = [];

  for (const provider of providers) {
    const rawJson = platformData.get(provider.platformName);
    if (!rawJson) continue;

    if (provider.capabilities.providesIdentity) {
      const id = provider.extractIdentity(rawJson);
      if (id) extractedIdentities.push(id);
    }
    if (provider.capabilities.providesActivity) {
      const activityData = provider.extractActivity(rawJson);
      
      if (activityData.lastActive) {
        if (!globalLastActive || new Date(activityData.lastActive).getTime() > new Date(globalLastActive).getTime()) {
          globalLastActive = activityData.lastActive;
        }
      }

      activityData.contributionSummary.forEach(a => a.source = 'evidence');
      allActivity.push(...activityData.contributionSummary);
    }
    if (provider.capabilities.providesProjects) {
      const projects = provider.extractProjects(rawJson);
      projects.forEach(p => p.evidence.forEach(e => e.source = 'evidence'));
      allProjects.push(...projects);
    }
    if (provider.capabilities.providesLanguages) {
      const langs = provider.extractLanguages(rawJson);
      langs.forEach(l => l.evidence.forEach(e => e.source = 'evidence'));
      allLanguages.push(...langs);
    }
    if (provider.capabilities.providesSignals) {
      const sigs = provider.extractSignals(rawJson);
      sigs.forEach(s => s.evidence.forEach(e => e.source = 'evidence'));
      allSignals.push(...sigs);
    }
  }

  // --- AGGREGATION & OVERRIDE MERGE LAYER ---

  // 1. Identity Resolution
  const identityOverride = overrides.get('identity:profile') || {};
  
  let resolvedName = identityOverride.name || null;
  let resolvedAvatar = identityOverride.avatarUrl || null;
  let resolvedBio = identityOverride.bio || null;
  let resolvedLocation = identityOverride.location || null;

  for (const id of extractedIdentities) {
    if (!resolvedName && id.name) resolvedName = id.name;
    if (!resolvedAvatar && id.avatarUrl) resolvedAvatar = id.avatarUrl;
    if (!resolvedBio && id.bio) resolvedBio = id.bio;
    if (!resolvedLocation && id.location) resolvedLocation = id.location;
  }

  const identity = {
    name: resolvedName || dbProfile.slug || null,
    avatarUrl: resolvedAvatar || null,
    headline: identityOverride.headline || null,
    bio: resolvedBio || null,
    location: resolvedLocation || null,
    source: (Object.keys(identityOverride).length > 0) ? 'override' : 'evidence' as 'override' | 'evidence'
  };

  // 2. Activity (Globally merged)
  const activitySummary = allActivity;

  // 3. Projects (Sort explicit metric, merge overrides)
  allProjects.sort((a, b) => {
    const aStars = a.evidence.find(e => e.label === 'Stars')?.value as number || 0;
    const bStars = b.evidence.find(e => e.label === 'Stars')?.value as number || 0;
    return bStars - aStars; // Explicit ranking
  });

  const mergedProjects: CanonicalProject[] = [];
  for (const project of allProjects) {
    const projectOverride = overrides.get(`project:${project.id}`);
    if (projectOverride?.isHidden) continue;

    const mergedProject = { ...project };
    if (projectOverride?.title) {
      mergedProject.title = projectOverride.title;
      mergedProject.titleSource = 'override';
    } else {
      mergedProject.titleSource = 'evidence';
    }
    if (projectOverride?.description) {
      mergedProject.description = projectOverride.description;
      mergedProject.descriptionSource = 'override';
    } else {
      mergedProject.descriptionSource = 'evidence';
    }
    mergedProjects.push(mergedProject);
  }

  // 4. Languages (Sort by explicitly counted repos)
  allLanguages.sort((a, b) => {
    const aRepos = a.evidence.find(e => e.label === 'Repositories')?.value as number || 0;
    const bRepos = b.evidence.find(e => e.label === 'Repositories')?.value as number || 0;
    return bRepos - aRepos;
  });

  // --- SNAPSHOT GENERATION ---
  const profileData: CanonicalProfile = {
    metadata: {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      slug: dbProfile.slug,
      isPublic: dbProfile.is_public,
    },
    identity,
    activity: {
      lastActive: globalLastActive,
      contributionSummary: activitySummary,
    },
    projects: mergedProjects.slice(0, 6),
    technicalFocus: {
      languages: allLanguages.slice(0, 6),
      technologies: []
    },
    developerSignals: allSignals
  };

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
