import { EvidenceProvider, ProviderCapabilities, PartialIdentity } from './types';
import { CanonicalProject, CanonicalLanguage, Evidence, DeveloperSignal } from '@devpro/types';

export class GithubProvider implements EvidenceProvider {
  platformName = 'github';
  
  capabilities: ProviderCapabilities = {
    providesIdentity: true,
    providesProjects: true,
    providesActivity: true,
    providesLanguages: true,
    providesSignals: false,
  };

  extractIdentity(rawJson: any): PartialIdentity | null {
    if (!rawJson?.profile) return null;
    return {
      name: rawJson.profile.name || rawJson.profile.login || null,
      avatarUrl: rawJson.profile.avatar_url || null,
      bio: rawJson.profile.bio || null,
      location: rawJson.profile.location || null,
    };
  }

  extractActivity(rawJson: any): { lastActive: string | null; contributionSummary: Evidence[] } {
    const contributionSummary: Evidence[] = [];
    if (rawJson?.stats?.total_stars !== undefined) {
      contributionSummary.push({ label: 'Total Stars', value: rawJson.stats.total_stars, sourcePlatform: 'github' });
    }

    let lastActive: string | null = null;
    if (rawJson?.repos && Array.isArray(rawJson.repos)) {
      let latestDate = 0;
      rawJson.repos.forEach((repo: any) => {
        if (repo.pushed_at) {
          const pushDate = new Date(repo.pushed_at).getTime();
          if (pushDate > latestDate) {
            latestDate = pushDate;
            lastActive = repo.pushed_at;
          }
        }
      });
    }

    return { lastActive, contributionSummary };
  }

  extractProjects(rawJson: any): CanonicalProject[] {
    let repos = rawJson?.repos || [];
    repos = repos.filter((repo: any) => !repo.fork || repo.stargazers_count > 5);
    
    return repos.map((repo: any) => {
      const tags: string[] = [];
      if (repo.topics && Array.isArray(repo.topics)) {
        tags.push(...repo.topics);
      }
      
      return {
        id: `gh-${repo.id}`,
        title: repo.name,
        description: repo.description,
        url: repo.html_url,
        tags,
        evidence: [
          { label: 'Stars', value: repo.stargazers_count, sourcePlatform: 'github' },
          ...(repo.forks_count > 0 ? [{ label: 'Forks', value: repo.forks_count, sourcePlatform: 'github' }] : []),
          ...(repo.open_issues_count > 0 ? [{ label: 'Open Issues', value: repo.open_issues_count, sourcePlatform: 'github' }] : []),
          ...(repo.language ? [{ label: 'Primary Language', value: repo.language, sourcePlatform: 'github' }] : [])
        ]
      };
    });
  }

  extractLanguages(rawJson: any): CanonicalLanguage[] {
    const languageMap = new Map<string, { repos: number, stars: number }>();
    
    if (rawJson?.repos && Array.isArray(rawJson.repos)) {
      rawJson.repos.forEach((repo: any) => {
        if (repo.language) {
          const current = languageMap.get(repo.language) || { repos: 0, stars: 0 };
          current.repos += 1;
          current.stars += (repo.stargazers_count || 0);
          languageMap.set(repo.language, current);
        }
      });
    }

    const languages: CanonicalLanguage[] = [];
    languageMap.forEach((stats, lang) => {
      const evidence: Evidence[] = [{ label: 'Repositories', value: stats.repos, sourcePlatform: 'github' }];
      if (stats.stars > 0) {
        evidence.push({ label: 'Earned Stars', value: stats.stars, sourcePlatform: 'github' });
      }
      languages.push({
        name: lang,
        evidence
      });
    });

    return languages;
  }

  extractSignals(rawJson: any): DeveloperSignal[] {
    return [];
  }
}
