import React from 'react';
import type { ActivityWidgetProps } from '../theme-engine/contracts';

export interface ActivityWidgetConfig extends ActivityWidgetProps {
  variant?: 'professional' | 'minimal' | 'terminal';
}

function formatRelativeDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  } catch {
    return null;
  }
}

export default function ActivityWidget({ activity, variant = 'professional' }: ActivityWidgetConfig) {
  const lastActive = activity?.lastActive;
  const contributionSummary = activity?.contributionSummary || [];
  
  if (!contributionSummary || contributionSummary.length === 0) {
    if (!lastActive) return null;
  }

  if (variant === 'terminal') {
    return (
      <div className="term-section py-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#666]">$</span>
          <span className="text-green-400">cat activity.log</span>
        </div>
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-4">
          <div className="text-xs space-y-2">
            {contributionSummary?.map((ev, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[#525252]">[log]</span>
                <span className="text-[#737373]">{ev.label}:</span>
                <span className="text-white font-bold tabular-nums">{ev.value}</span>
                {ev.sourcePlatform && (
                  <span className="text-[#525252]">({ev.sourcePlatform})</span>
                )}
              </div>
            ))}
            {lastActive && (
              <div className="flex items-center gap-2 pt-1 border-t border-[#1a1a1a]">
                <span className="text-[#525252]">[log]</span>
                <span className="text-[#737373]">last_active:</span>
                <span className="text-[#22d3ee]">{lastActive}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <footer className="pt-8 border-t border-stone-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-500">
        {lastActive && (
          <div className="flex items-center gap-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-stone-400">Active</span>
            <span className="text-stone-700">{formatRelativeDate(lastActive)}</span>
          </div>
        )}
        {contributionSummary?.map((ev, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-stone-400">{ev.label}</span>
            <span className="text-stone-700 tabular-nums">{ev.value}</span>
          </div>
        ))}
      </footer>
    );
  }

  // Professional variant
  return (
    <section className="animate-fadeInUp stagger-6 mb-20 md:mb-28">
      <h2 className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-8 flex items-center gap-4">
        Activity Summary
        <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-purple-500 opacity-20"></div>
      </h2>
      <div 
        className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex flex-wrap gap-8">
          {contributionSummary?.map((ev, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-sm font-semibold tracking-wider text-slate-500 uppercase">{ev.label}</span>
              <span className="text-3xl font-bold text-slate-200 tabular-nums">{ev.value}</span>
            </div>
          ))}
        </div>
        
        {lastActive && (
          <div className="shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.5)] animate-pulse"></div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Last Active</div>
              <div className="text-sm font-medium text-slate-300">{formatRelativeDate(lastActive) || lastActive}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
