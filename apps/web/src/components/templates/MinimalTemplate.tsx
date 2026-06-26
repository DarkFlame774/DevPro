

import React from 'react';
import type { CanonicalProfile } from '@devpro/types';
import HeroWidget from '../widgets/HeroWidget';
import SnapshotWidget from '../widgets/SnapshotWidget';
import TechnicalFocusWidget from '../widgets/TechnicalFocusWidget';
import ProjectsWidget from '../widgets/ProjectsWidget';
import SignalsWidget from '../widgets/SignalsWidget';
import ActivityWidget from '../widgets/ActivityWidget';
import type { ThemeManifest } from '../theme-engine/contracts';

export const manifest: ThemeManifest = {
  id: 'minimal',
  name: 'Minimal',
  version: '1.0.0',
  author: 'DevPro',
  engineVersion: '1.0.0',
  minimumSchema: 1,
  maximumSchema: 1,
  capabilities: {
    darkMode: false,
    customAccents: false,
  },
  layout: {
    type: 'single-column',
    slots: ['header', 'primary']
  }
};

interface MinimalTemplateProps {
  profile: CanonicalProfile;
  slug: string;
}

export default function MinimalTemplate({ profile, slug }: MinimalTemplateProps) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      
      <div className="min-h-screen bg-[#fafafa] text-stone-900 selection:bg-stone-200" style={{ fontFamily: "'Inter', sans-serif" }}>
        <main className="max-w-2xl mx-auto px-6 py-12 md:py-20">
          <div className="space-y-12">
            <HeroWidget 
              variant="minimal" 
              identity={profile.identity} 
              slug={slug} 
            />
            <SnapshotWidget 
              variant="minimal" 
              snapshot={profile.developerSnapshot} 
            />
            <TechnicalFocusWidget 
              variant="minimal" 
              technicalFocus={profile.technicalFocus || { languages: [], technologies: [] }} 
            />
            <ProjectsWidget 
              variant="compact" 
              projects={profile.projects || []} 
            />
            <SignalsWidget 
              variant="minimal" 
              signals={profile.developerSignals || []} 
            />
            <ActivityWidget 
              variant="minimal" 
              activity={profile.activity || { lastActive: null, contributionSummary: [] }} 
            />
          </div>
        </main>
      </div>
    </>
  );
}
