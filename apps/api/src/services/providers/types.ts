import { CanonicalProject, CanonicalLanguage, DeveloperSignal, Evidence } from '@devpro/types';

export interface ProviderCapabilities {
  providesIdentity: boolean;
  providesProjects: boolean;
  providesActivity: boolean;
  providesLanguages: boolean;
  providesSignals: boolean;
}

export interface PartialIdentity {
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
}

export interface ProviderActivity {
  lastActive: string | null;
  contributionSummary: Evidence[];
}

export interface EvidenceProvider {
  platformName: string;
  capabilities: ProviderCapabilities;
  
  extractIdentity(rawJson: any): PartialIdentity | null;
  extractActivity(rawJson: any): ProviderActivity;
  extractProjects(rawJson: any): CanonicalProject[];
  extractLanguages(rawJson: any): CanonicalLanguage[];
  extractSignals(rawJson: any): DeveloperSignal[];
}
