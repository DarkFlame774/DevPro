import React from 'react';
import type { SignalsWidgetProps } from '../theme-engine/contracts';

export interface SignalsWidgetConfig extends SignalsWidgetProps {
  variant?: 'professional' | 'minimal' | 'terminal';
}

export default function SignalsWidget({ signals, variant = 'professional' }: SignalsWidgetConfig) {
  if (!signals || signals.length === 0) return null;

  if (variant === 'terminal') {
    return (
      <div className="term-section py-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#666]">$</span>
          <span className="text-green-400">./analyze.sh</span>
        </div>
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-4">
          <div className="text-xs space-y-4">
            <div className="text-[#525252]">
              {"// "}analysis results — {signals.length} signal{signals.length !== 1 ? "s" : ""} detected
            </div>
            {signals.map((signal, idx) => {
              const observation = signal.observations[0] || '';
              return (
                <div key={idx}>
                  <div className="text-[#fbbf24] font-bold">
                    ┌─ [{observation}]
                  </div>
                  {signal.evidence.map((ev, i) => {
                    const isLast = i === signal.evidence.length - 1;
                    return (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-[#525252] shrink-0">
                          {isLast ? "└─" : "├─"}
                        </span>
                        <span className="text-[#737373]">
                          {ev.label}:
                        </span>
                        <span className="text-[#4ade80]">
                          {ev.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    // Flatten signals to list of observations
    const observations = signals.flatMap((s) => s.observations);
    return (
      <section className="py-5 border-b border-stone-200">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-400 mb-3 select-none">
          Developer Signals
        </h2>
        <ul className="space-y-2">
          {observations.map((obs, i) => (
            <li key={i} className="text-sm text-stone-600 leading-snug flex items-start gap-2">
              <span className="text-stone-300 select-none">—</span>
              <span>{obs}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // Professional variant
  return (
    <section className="animate-fadeInUp stagger-5 mb-20 md:mb-28">
      <h2 className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-8 flex items-center gap-4">
        Developer Signals
        <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-purple-500 opacity-20"></div>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {signals.map((signal, idx) => {
          const mainObservation = signal.observations[0];
          if (!mainObservation) return null;
          return (
            <div
              key={idx}
              className="rounded-xl p-5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h3 className="relative text-slate-200 font-semibold mb-4 leading-snug">
                {mainObservation}
              </h3>
              {signal.evidence.length > 0 && (
                <div className="relative space-y-2">
                  <div className="h-px bg-slate-700/50 w-8 mb-3"></div>
                  {signal.evidence.map((ev, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-blue-400">{ev.value}</span>
                      <span className="text-slate-500">{ev.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
