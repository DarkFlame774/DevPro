import React from 'react';
import type { ProjectsWidgetProps } from '../theme-engine/contracts';

export interface ProjectsWidgetConfig extends ProjectsWidgetProps {
  variant?: 'grid' | 'compact' | 'terminal';
}

export default function ProjectsWidget({ projects, variant = 'grid' }: ProjectsWidgetConfig) {
  if (!projects || projects.length === 0) return null;

  if (variant === 'terminal') {
    return (
      <div className="term-section py-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#666]">$</span>
          <span className="text-green-400">ls ~/projects --sort=stars</span>
        </div>
        <div className="mt-3 space-y-2">
          {projects.map((proj) => (
            <a
              key={proj.id}
              href={proj.url}
              target="_blank"
              rel="noreferrer"
              className="group block bg-[#111111] border border-[#1a1a1a] rounded-lg p-4 hover:border-[#2a2a2a] hover:bg-[#131313] transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[#525252] text-xs">
                      drwxr-xr-x
                    </span>
                    <span className="text-[#22d3ee] group-hover:text-[#67e8f9] font-bold text-sm truncate transition-colors duration-200">
                      {proj.title}
                    </span>
                  </div>
                  <p className="text-[#525252] text-xs mt-1 line-clamp-1 pl-[4.5rem] sm:pl-0">
                    {proj.description || "No description."}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 pl-[4.5rem] sm:pl-0">
                  {proj.evidence.map((ev, i) => (
                    <span
                      key={i}
                      className="text-[#fbbf24]/80 text-xs whitespace-nowrap"
                    >
                      {ev.label}:{" "}
                      <span className="text-[#fbbf24] font-bold">
                        {ev.value}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              {proj.tags && proj.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 pl-[4.5rem] sm:pl-0">
                  {proj.tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-[#0a0a0a] border border-[#1a1a1a] text-[#525252]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <section className="py-5 border-b border-stone-200">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-400 mb-3 select-none">
          Projects
        </h2>
        <div className="flex flex-col">
          {projects.map((proj) => (
            <a
              key={proj.id}
              href={proj.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 px-2 -mx-2 hover:bg-stone-50 rounded transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-sm font-semibold text-stone-900 group-hover:text-stone-600 transition-colors truncate">
                    {proj.title}
                  </h3>
                  {proj.tags && proj.tags.length > 0 && (
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0 overflow-hidden">
                      {proj.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] text-stone-400 bg-stone-100 px-1 rounded truncate max-w-[80px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {proj.description && (
                  <p className="text-xs text-stone-500 mt-1 line-clamp-1">{proj.description}</p>
                )}
              </div>
              {proj.evidence.length > 0 && (
                <div className="flex items-center gap-3 shrink-0">
                  {proj.evidence.map((ev, i) => (
                    <div key={i} className="flex items-center gap-1 text-[11px] text-stone-400">
                      <span className="font-medium text-stone-600">{ev.value}</span>
                      <span className="text-stone-400/80">{ev.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      </section>
    );
  }

  // Professional Grid variant
  return (
    <section className="animate-fadeInUp stagger-4 mb-20 md:mb-28">
      <h2 className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-8 flex items-center gap-4">
        Featured Projects
        <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-purple-500 opacity-20"></div>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((proj) => (
          <a
            key={proj.id}
            href={proj.url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col h-full rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative flex-1 flex flex-col min-h-[140px]">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-lg font-bold text-slate-200 group-hover:text-blue-400 transition-colors leading-tight">
                  {proj.title}
                </h3>
                <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                {proj.description || "No description provided."}
              </p>
              
              <div className="mt-auto space-y-4">
                {proj.tags && proj.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {proj.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-700/30">
                  {proj.evidence.map((ev, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                      <span className="text-blue-400/90">{ev.value}</span>
                      <span className="text-slate-500">{ev.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
