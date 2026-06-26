'use client';

import React from 'react';
import type { CanonicalProfile } from '@devpro/types';
import HeroWidget from '../widgets/HeroWidget';
import TechnicalFocusWidget from '../widgets/TechnicalFocusWidget';
import ProjectsWidget from '../widgets/ProjectsWidget';
import SignalsWidget from '../widgets/SignalsWidget';
import ActivityWidget from '../widgets/ActivityWidget';

interface TerminalTemplateProps {
  profile: CanonicalProfile;
  slug: string;
}

const TERMINAL_STYLES = `
@keyframes terminalReveal {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
}
.term-section {
  animation: terminalReveal 0.4s ease-out both;
}
.term-section:nth-child(1)  { animation-delay: 0.05s; }
.term-section:nth-child(2)  { animation-delay: 0.10s; }
.term-section:nth-child(3)  { animation-delay: 0.15s; }
.term-section:nth-child(4)  { animation-delay: 0.20s; }
.term-section:nth-child(5)  { animation-delay: 0.25s; }
.term-section:nth-child(6)  { animation-delay: 0.30s; }
.term-cursor {
  animation: cursorBlink 1s step-end infinite;
}
`;

function SectionDivider() {
  return <div className="border-t border-[#1a1a1a] w-full" />;
}

export default function TerminalTemplate({ profile, slug }: TerminalTemplateProps) {
  const name = profile.identity?.name || slug;
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: TERMINAL_STYLES }} />
      
      <div className="min-h-screen bg-[#000000] text-[#a3a3a3] selection:bg-green-900/40 selection:text-green-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl">
            {/* Terminal Chrome Header */}
            <div className="flex items-center px-4 py-3 border-b border-[#1a1a1a] bg-[#050505]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-[0_0_8px_rgba(255,95,87,0.4)]"></div>
                <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-[0_0_8px_rgba(254,188,46,0.4)]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-[0_0_8px_rgba(40,200,64,0.4)]"></div>
              </div>
              <div className="flex-1 text-center text-[#525252] text-xs font-bold tracking-widest uppercase">
                {name} — bash
              </div>
              <div className="w-16"></div> {/* Spacer for centering */}
            </div>

            <div className="p-6 sm:p-8">
              <HeroWidget 
                variant="terminal" 
                identity={profile.identity} 
                slug={slug} 
                snapshot={profile.developerSnapshot} 
              />
              <SectionDivider />
              <TechnicalFocusWidget 
                variant="terminal" 
                technicalFocus={profile.technicalFocus || { languages: [], technologies: [] }} 
              />
              <SectionDivider />
              <ProjectsWidget 
                variant="terminal" 
                projects={profile.projects || []} 
              />
              <SectionDivider />
              <SignalsWidget 
                variant="terminal" 
                signals={profile.developerSignals || []} 
              />
              <SectionDivider />
              <ActivityWidget 
                variant="terminal" 
                activity={profile.activity || { lastActive: null, contributionSummary: [] }} 
              />
              <SectionDivider />
              <div className="term-section pt-6">
                <div className="flex items-center gap-1">
                  <span className="text-[#525252]">$</span>
                  <span className="text-[#4ade80]">&nbsp;</span>
                  <span className="term-cursor inline-block w-2.5 h-[18px] bg-[#4ade80] rounded-[1px] shadow-[0_0_8px_rgba(74,222,128,0.3)]" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
