import React from 'react';
import type { SnapshotWidgetProps } from '../theme-engine/contracts';

export interface SnapshotWidgetConfig extends SnapshotWidgetProps {
  variant?: 'professional' | 'minimal' | 'terminal';
}

export default function SnapshotWidget({ snapshot, variant = 'professional' }: SnapshotWidgetConfig) {
  if (!snapshot || snapshot.length === 0) return null;

  if (variant === 'minimal') {
    return (
      <div className="flex flex-wrap gap-1.5 mt-3">
        {snapshot.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded select-none"
          >
            {item.label}
          </span>
        ))}
      </div>
    );
  }

  if (variant === 'terminal') {
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {snapshot.map((s, i) => (
          <span key={i} className="text-xs px-2 py-0.5 border border-green-900 text-green-500 rounded bg-green-900/10">
            {s.label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <section className="mb-20 md:mb-28">
      <h2 className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-8 flex items-center gap-4">
        Developer Snapshot
        <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-purple-500 opacity-20"></div>
      </h2>
      <div className="flex flex-wrap gap-3">
        {snapshot.map((item, idx) => (
          <div key={idx} className="relative group">
            <span className="accent-badge inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-blue-200 cursor-default"
              style={{
                background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(167, 139, 250, 0.15))',
                border: '1px solid rgba(96, 165, 250, 0.2)',
                boxShadow: '0 0 12px rgba(96, 165, 250, 0.08)',
                transition: 'all 0.3s ease',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                  animation: "pulseGlow 3s ease-in-out infinite",
                  animationDelay: `${idx * 400}ms`,
                }}
              />
              {item.label}
            </span>

            {/* Evidence tooltip on hover */}
            {item.evidence && item.evidence.length > 0 && (
              <div className="absolute z-20 top-full left-0 mt-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="rounded-lg p-3 shadow-2xl" style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(16px)',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  borderWidth: '1px'
                }}>
                  {item.evidence.map((ev, i) => (
                    <div
                      key={i}
                      className="text-xs text-slate-400 py-0.5"
                    >
                      <span className="text-slate-300 font-medium">
                        {ev.value}
                      </span>{" "}
                      {ev.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
