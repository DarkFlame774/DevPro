import React from 'react';
import type { HeroWidgetProps } from '../theme-engine/contracts';

export interface HeroWidgetConfig extends HeroWidgetProps {
  variant?: 'professional' | 'minimal' | 'terminal';
  snapshot?: any[];
}

export default function HeroWidget({ identity, slug, variant = 'professional' }: HeroWidgetConfig) {
  const name = identity?.name || slug;
  
  if (variant === 'terminal') {
    return (
      <div className="term-section">
        <div className="text-green-400">
          <span className="text-[#666]">$</span> whoami
        </div>
        <div className="mt-2 flex items-center gap-4">
          {identity?.avatarUrl && (
            <img
              src={identity.avatarUrl}
              alt={name}
              className="w-14 h-14 rounded-lg border border-[#2a2a2a] object-cover"
            />
          )}
          <div>
            <div className="text-white text-lg font-bold">{name}</div>
            {identity?.location && <div className="text-[#666] text-xs mt-0.5">┌ {identity.location}</div>}
          </div>
        </div>
        <div className="mt-2 text-[#999] max-w-xl">
          {identity?.bio || identity?.headline || "Software Engineer & Open Source Contributor"}
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <header className="pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3.5">
          {identity?.avatarUrl && (
            <img
              src={identity.avatarUrl}
              alt={name}
              className="w-10 h-10 rounded-full grayscale hover:grayscale-0 transition-all duration-200 object-cover flex-shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h1 className="text-lg font-semibold text-stone-900 leading-tight truncate">
                {name}
              </h1>
              {identity?.location && (
                <span className="text-xs text-stone-400 font-normal whitespace-nowrap">
                  {identity.location}
                </span>
              )}
            </div>
            {identity?.headline && (
              <p className="text-sm text-stone-500 leading-snug mt-0.5 truncate">{identity.headline}</p>
            )}
          </div>
        </div>

        {identity?.bio && (
          <p className="text-sm text-stone-600 leading-relaxed mt-3 max-w-prose">{identity.bio}</p>
        )}
      </header>
    );
  }

  // Professional variant
  return (
    <header className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10 mb-20 animate-fadeInUp" style={{ animationDelay: '0ms' }}>
      {identity?.avatarUrl && (
        <div className="relative group shrink-0">
          <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          <img
            src={identity.avatarUrl}
            alt={name}
            className="relative w-36 h-36 md:w-44 md:h-44 rounded-2xl object-cover border border-slate-700/50 shadow-2xl"
          />
        </div>
      )}
      <div className="text-center md:text-left flex-1 space-y-5">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-blue-100 to-slate-300 leading-tight">
          {name}
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed font-medium">
          {identity?.bio || identity?.headline || "Software Engineer"}
        </p>
        {identity?.location && (
          <p className="text-sm text-slate-500 flex items-center justify-center md:justify-start gap-2 font-medium">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {identity.location}
          </p>
        )}
      </div>
    </header>
  );
}
