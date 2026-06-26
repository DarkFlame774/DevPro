import { EvidenceProvider, ProviderCapabilities, PartialIdentity } from './types';
import { CanonicalProject, CanonicalLanguage, Evidence, DeveloperSignal } from '@devpro/types';

export class LeetCodeProvider implements EvidenceProvider {
  platformName = 'leetcode';
  
  capabilities: ProviderCapabilities = {
    providesIdentity: true,
    providesProjects: false,
    providesActivity: true,
    providesLanguages: false,
    providesSignals: true,
  };

  extractIdentity(rawJson: any): PartialIdentity | null {
    if (!rawJson?.profile) return null;
    return {
      name: rawJson.profile.realName || null,
      avatarUrl: rawJson.profile.userAvatar || null,
      bio: rawJson.profile.aboutMe || null,
      location: null,
    };
  }

  extractActivity(rawJson: any): { lastActive: string | null; contributionSummary: Evidence[] } {
    const contributionSummary: Evidence[] = [];
    if (rawJson?.stats?.submitStats?.acSubmissionNum?.[0]?.count) {
      contributionSummary.push({ 
        label: 'Total Problems Solved', 
        value: rawJson.stats.submitStats.acSubmissionNum[0].count, 
        sourcePlatform: 'leetcode' 
      });
    }
    return { lastActive: null, contributionSummary };
  }

  extractProjects(rawJson: any): CanonicalProject[] {
    return [];
  }

  extractLanguages(rawJson: any): CanonicalLanguage[] {
    return [];
  }

  extractSignals(rawJson: any): DeveloperSignal[] {
    const signals: DeveloperSignal[] = [];
    const problemsSolved = rawJson?.stats?.submitStats?.acSubmissionNum?.[0]?.count || 0;
    const ranking = rawJson?.stats?.profile?.ranking;
    
    if (problemsSolved > 50) {
      let observation = 'Practicing Algorithmic Problem Solving';
      if (problemsSolved > 300) observation = 'Consistent Problem Solver';
      if (ranking && ranking < 100000) observation = 'Top Ranked Problem Solver';

      const evidence: Evidence[] = [{ label: 'Problems Solved', value: problemsSolved, sourcePlatform: 'leetcode' }];
      if (ranking) {
        evidence.push({ label: 'Global Rank', value: ranking, sourcePlatform: 'leetcode' });
      }

      signals.push({
        observations: [observation],
        evidence
      });
    }
    return signals;
  }
}
