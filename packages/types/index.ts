// Shared Types for DevPro
// This file will hold types shared between the API and the Web app.
export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface SignupRequest {
  email?: string;
  password?: string;
}

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface Evidence {
  label: string;
  value: string | number;
  sourcePlatform: string;
  source?: 'evidence' | 'override';
}

export interface CanonicalProject {
  id: string;
  title: string;
  titleSource?: 'evidence' | 'override';
  description: string | null;
  descriptionSource?: 'evidence' | 'override';
  url: string;
  evidence: Evidence[];
}

export interface CanonicalLanguage {
  name: string;
  category?: string;
  evidence: Evidence[];
}

export interface CanonicalTechnology {
  name: string;
  evidence: Evidence[];
}

export interface DeveloperSignal {
  observations: string[];
  evidence: Evidence[];
}

export interface CanonicalProfile {
  metadata: {
    schemaVersion: number;
    generatedAt: string;
    isPublic: boolean;
    slug: string | null;
  };
  identity: {
    name: string | null;
    avatarUrl: string | null;
    headline: string | null;
    bio: string | null;
    location: string | null;
    source?: 'evidence' | 'override';
  };
  activity: {
    lastActive: string | null;
    contributionSummary: Evidence[];
  };
  projects: CanonicalProject[];
  technicalFocus: {
    languages: CanonicalLanguage[];
    technologies: CanonicalTechnology[];
  };
  developerSignals: DeveloperSignal[];
}

export type TemplateType = 'minimal' | 'professional' | 'terminal';
export type AccentColor = 'blue' | 'purple' | 'emerald';
