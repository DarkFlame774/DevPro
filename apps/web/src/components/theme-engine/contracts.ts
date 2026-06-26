/**
 * DevPro Theme Engine — Manifest & Contract Types
 * 
 * These types define the contracts that all themes and widgets must adhere to.
 * They prepare DevPro for a future marketplace where community creators
 * can build and distribute themes without understanding the platform internals.
 */

import {
  CanonicalProfile,
  CanonicalProject,
  CanonicalLanguage,
  CanonicalTechnology,
  Evidence,
  DeveloperSignal,
  SnapshotItem,
} from '@devpro/types';

// ─── Theme Manifest ─────────────────────────────────────────────────────────

export interface ThemeManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  engineVersion: string;
  minimumSchema: number;
  maximumSchema: number;
  capabilities?: {
    darkMode?: boolean;
    customAccents?: boolean;
  };
  layout: {
    type: 'single-column' | 'two-column' | 'stream';
    slots: SlotName[];
  };
}

// ─── Widget Manifest ────────────────────────────────────────────────────────

export interface WidgetManifest {
  id: string;
  name: string;
  version: string;
  supportedDomains: DataDomain[];
  minimumSchema: number;
  maximumSchema: number;
}

// ─── Data Domains ───────────────────────────────────────────────────────────
// These are platform-level concepts, not widgets.
// Multiple widgets may visualize the same domain.

export type DataDomain =
  | 'identity'
  | 'developerSnapshot'
  | 'activity'
  | 'projects'
  | 'technicalFocus'
  | 'developerSignals';

// ─── Slot Architecture ──────────────────────────────────────────────────────
// Themes arrange widgets inside slots.

export type SlotName = 'header' | 'primary' | 'secondary' | 'footer';

// ─── Widget Props (Domain-Scoped) ───────────────────────────────────────────
// Widgets receive ONLY the data domain they require. Not the entire profile.

export interface HeroWidgetProps {
  identity: CanonicalProfile['identity'];
  slug: string;
}

export interface SnapshotWidgetProps {
  snapshot: SnapshotItem[];
}

export interface ActivityWidgetProps {
  activity: CanonicalProfile['activity'];
}

export interface TechnicalFocusWidgetProps {
  technicalFocus: {
    languages: CanonicalLanguage[];
    technologies: CanonicalTechnology[];
  };
}

export interface ProjectsWidgetProps {
  projects: CanonicalProject[];
}

export interface SignalsWidgetProps {
  signals: DeveloperSignal[];
}

// ─── Theme Component Props ──────────────────────────────────────────────────
// The top-level theme component still receives the full profile,
// but it MUST decompose it into domain-scoped widget props internally.

export interface ThemeProps {
  profile: CanonicalProfile;
  slug: string;
}
