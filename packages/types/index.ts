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

export interface ProfileData {
  user: {
    name: string | null;
    bio: string | null;
    avatar_url: string | null;
    location: string | null;
  };
  stats: {
    total_stars: number;
    followers: number;
    top_languages: Record<string, number>;
  };
  featuredProjects: Array<{
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
  }>;
  leetcode: any | null;
  metadata: {
    template: TemplateType;
    is_public: boolean;
    slug: string | null;
    generated_at: string;
  };
}

export type TemplateType = 'minimal' | 'professional' | 'terminal';
