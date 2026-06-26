import React from 'react';
import type { TechnicalFocusWidgetProps } from '../theme-engine/contracts';
import { CanonicalLanguage } from '@devpro/types';

export interface TechnicalFocusWidgetConfig extends TechnicalFocusWidgetProps {
  variant?: 'professional' | 'minimal' | 'terminal';
}

const BAR_LENGTH = 24;
const FILLED = "█";
const EMPTY = "░";

function renderBar(value: number, max: number): string {
  const filled = max > 0 ? Math.round((value / max) * BAR_LENGTH) : 0;
  return FILLED.repeat(filled) + EMPTY.repeat(BAR_LENGTH - filled);
}

export default function TechnicalFocusWidget({ technicalFocus, variant = 'professional' }: TechnicalFocusWidgetConfig) {
  const languages = technicalFocus?.languages || [];
  if (!languages || languages.length === 0) return null;

  if (variant === 'terminal') {
    const withValues = languages.map((lang) => {
      const numericEv = lang.evidence.find((ev) => typeof ev.value === "number");
      return {
        name: lang.name,
        value: (numericEv?.value as number) || 0,
        label: numericEv?.label || "",
      };
    });
    const maxVal = Math.max(...withValues.map((l) => l.value), 1);

    return (
      <div className="term-section py-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#666]">$</span>
          <span className="text-green-400">cat skills.json</span>
        </div>
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-4 overflow-x-auto">
          <div className="space-y-1.5 text-xs">
            <div className="text-[#525252]">{"{"}</div>
            <div className="text-[#525252] pl-2">
              {'"languages"'}: [
            </div>
            {withValues.map((lang, idx) => {
              const bar = renderBar(lang.value, maxVal);
              const isLast = idx === withValues.length - 1;
              return (
                <div key={lang.name} className="flex items-center gap-2 pl-4">
                  <span className="text-[#fbbf24] w-28 sm:w-32 text-right truncate shrink-0" title={lang.name}>
                    {`"${lang.name}"`}
                  </span>
                  <span className="text-[#525252]">:</span>
                  <span className="text-[#4ade80]/70 tracking-[-0.05em] whitespace-nowrap">
                    {bar}
                  </span>
                  <span className="text-[#fbbf24] ml-2 shrink-0">{lang.value}</span>
                  {!isLast && <span className="text-[#525252]">,</span>}
                </div>
              );
            })}
            <div className="text-[#525252] pl-2">]</div>
            <div className="text-[#525252]">{"}"}</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <section className="py-5 border-b border-stone-200">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-400 mb-3 select-none">
          Technical Focus
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {languages.map((lang) => {
            const count = lang.evidence.length;
            return (
              <span
                key={lang.name}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 border border-stone-200 px-2 py-1 rounded select-none"
              >
                {lang.name}
                {count > 0 && (
                  <span className="text-[10px] text-stone-400 bg-stone-100 px-1 rounded">
                    {count}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </section>
    );
  }

  // Professional variant
  const languageGroups = languages.reduce((acc, lang) => {
    const cat = lang.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(lang);
    return acc;
  }, {} as Record<string, CanonicalLanguage[]>);

  return (
    <section className="animate-fadeInUp stagger-3 mb-20 md:mb-28">
      <h2 className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-8 flex items-center gap-4">
        Technical Focus
        <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-purple-500 opacity-20"></div>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(languageGroups).map(([category, langs]) => (
          <div
            key={category}
            className="rounded-xl p-5 transition-all duration-300"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400/80 mb-4">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {langs.map((lang) => {
                const primaryEvidence = lang.evidence[0];
                return (
                  <span
                    key={lang.name}
                    className="group/lang relative px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-200 cursor-default"
                  >
                    {lang.name}
                    {primaryEvidence && (
                      <span className="ml-1.5 text-[10px] text-slate-500 font-normal">
                        {primaryEvidence.value}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
