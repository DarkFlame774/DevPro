

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
  id: 'professional',
  name: 'Professional',
  version: '1.0.0',
  author: 'DevPro',
  engineVersion: '1.0.0',
  minimumSchema: 1,
  maximumSchema: 1,
  capabilities: {
    darkMode: true,
    customAccents: true,
  },
  layout: {
    type: 'single-column',
    slots: ['header', 'primary', 'footer']
  }
};

interface ProfessionalTemplateProps {
  profile: CanonicalProfile;
  slug: string;
}

export default function ProfessionalTemplate({ profile, slug }: ProfessionalTemplateProps) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 10px rgba(96, 165, 250, 0.5); }
          50% { opacity: 0.6; transform: scale(0.85); box-shadow: 0 0 0 rgba(96, 165, 250, 0); }
        }
        .animate-fadeInUp {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .stagger-1 { animation-delay: 100ms; }
        .stagger-2 { animation-delay: 200ms; }
        .stagger-3 { animation-delay: 300ms; }
        .stagger-4 { animation-delay: 400ms; }
        .stagger-5 { animation-delay: 500ms; }
        .stagger-6 { animation-delay: 600ms; }
      `}} />

      <div className="min-h-screen text-slate-300 selection:bg-blue-500/30 selection:text-blue-200 relative overflow-hidden font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Background Gradients */}
        <div className="fixed inset-0 bg-[#0a0f1e] -z-20"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-[#0f172a] via-[#0c1220] to-[#0a0f1e] opacity-80 -z-10"></div>
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none blur-[100px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600 via-purple-900 to-transparent -z-10"></div>

        <main className="max-w-4xl mx-auto px-6 py-12 md:py-32 relative z-10">
          <HeroWidget 
            variant="professional" 
            identity={profile.identity} 
            slug={slug} 
          />
          <SnapshotWidget 
            variant="professional" 
            snapshot={profile.developerSnapshot} 
          />
          <TechnicalFocusWidget 
            variant="professional" 
            technicalFocus={profile.technicalFocus || { languages: [], technologies: [] }} 
          />
          <ProjectsWidget 
            variant="grid" 
            projects={profile.projects || []} 
          />
          <SignalsWidget 
            variant="professional" 
            signals={profile.developerSignals || []} 
          />
          <ActivityWidget 
            variant="professional" 
            activity={profile.activity || { lastActive: null, contributionSummary: [] }} 
          />
        </main>
      </div>
    </>
  );
}
