"use client";

import { CanonicalProfile } from "@devpro/types";

interface Props {
  profile: CanonicalProfile;
  slug: string;
}

export default function TerminalTemplate({ profile, slug }: Props) {
  const { 
    identity = {} as any, 
    activity = { contributionSummary: [] }, 
    technicalFocus = { languages: [], technologies: [] }, 
    developerSignals = [], 
    projects = [] 
  } = profile || {};

  const topLangs = technicalFocus.languages?.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#b0b0b0] font-mono selection:bg-green-900/40 selection:text-green-300">

      <main className="max-w-3xl mx-auto px-6 py-12">

        {/* ── Terminal Window Chrome ── */}
        <div className="border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">

          {/* Title Bar */}
          <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-3 border-b border-[#2a2a2a]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-xs text-[#666] ml-2">
              {identity.name || slug} — devpro
            </span>
          </div>

          {/* Terminal Body */}
          <div className="bg-[#0c0c0c] p-6 md:p-8 space-y-6 text-sm leading-relaxed">

            {/* ── whoami ── */}
            <div>
              <div className="text-green-400">
                <span className="text-[#666]">$</span> whoami
              </div>
              <div className="mt-2 flex items-center gap-4">
                {identity.avatarUrl && (
                  <img
                    src={identity.avatarUrl}
                    alt={identity.name || slug}
                    className="w-14 h-14 rounded-lg border border-[#2a2a2a] object-cover"
                  />
                )}
                <div>
                  <div className="text-white text-lg font-bold">{identity.name || slug}</div>
                  {identity.location && <div className="text-[#666] text-xs mt-0.5">📍 {identity.location}</div>}
                </div>
              </div>
              <div className="mt-2 text-[#999]">
                {identity.bio || identity.headline || "Software Engineer & Open Source Contributor"}
              </div>
            </div>

            <div className="border-t border-[#1a1a1a]" />

            {/* ── stats ── */}
            <div>
              <div className="text-green-400">
                <span className="text-[#666]">$</span> cat stats.json
              </div>
              <div className="mt-2 bg-[#111] border border-[#1e1e1e] rounded-lg p-4">
                <pre className="text-xs">
{`{
${activity.contributionSummary.map(ev => `  "${ev.label.toLowerCase().replace(/ /g, '_')}": ${ev.value}`).join(',\n')}${activity.contributionSummary.length > 0 ? ',' : ''}
  "public_projects": ${projects.length}+
}`}
                </pre>
              </div>
            </div>

            <div className="border-t border-[#1a1a1a]" />

            {/* ── languages ── */}
            <div>
              <div className="text-green-400">
                <span className="text-[#666]">$</span> cat languages.txt
              </div>
              <div className="mt-3 space-y-2">
                {topLangs.map((lang) => {
                  const val = lang.evidence[0]?.value as number || 0;
                  const maxCount = Math.max(...topLangs.map((l) => (l.evidence[0]?.value as number) || 0));
                  const barWidth = maxCount > 0 ? Math.round((val / maxCount) * 20) : 0;
                  return (
                    <div key={lang.name} className="flex items-center gap-3">
                      <span className="w-24 text-right text-[#888] text-xs truncate" title={lang.name}>{lang.name}</span>
                      <span className="text-green-500 tracking-tighter">{"█".repeat(barWidth)}{"░".repeat(20 - barWidth)}</span>
                      <span className="text-[#555] text-xs">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Developer Signals ── */}
            {developerSignals.length > 0 && (
              <>
                <div className="border-t border-[#1a1a1a]" />
                <div>
                  <div className="text-green-400">
                    <span className="text-[#666]">$</span> cat signals.log
                  </div>
                  <div className="mt-2 bg-[#111] border border-[#1e1e1e] rounded-lg p-4">
                    <div className="text-xs space-y-3">
                      {developerSignals.map((signal, idx) => (
                        <div key={idx}>
                          <div className="text-amber-400 font-bold mb-1">[{signal.observations[0]}]</div>
                          {signal.evidence.map((ev, i) => (
                            <div key={i}>
                              <span className="text-[#666]">{ev.label.toLowerCase().padEnd(12)}:</span>{" "}
                              <span className="text-emerald-400">{ev.value}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="border-t border-[#1a1a1a]" />

            {/* ── repos ── */}
            <div>
              <div className="text-green-400">
                <span className="text-[#666]">$</span> ls ~/projects --sort=stars
              </div>
              <div className="mt-3 space-y-2">
                {projects.map((proj) => (
                  <a
                    key={proj.id}
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block bg-[#111] border border-[#1e1e1e] rounded-lg p-4 hover:border-green-900/50 hover:bg-[#141414] transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <span className="text-cyan-400 group-hover:text-cyan-300 font-bold text-sm">
                          {proj.title}
                        </span>
                        <p className="text-[#666] text-xs mt-1 line-clamp-1">
                          {proj.description || "No description."}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {proj.evidence.map((ev, i) => (
                          <span key={i} className="text-amber-400/70 text-xs shrink-0">{ev.label}: {ev.value}</span>
                        ))}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="border-t border-[#1a1a1a]" />

            {/* ── Blinking cursor ── */}
            <div className="text-green-400">
              <span className="text-[#666]">$</span>{" "}
              <span className="inline-block w-2 h-4 bg-green-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="mt-8 text-center text-[#333] text-xs">
          Built with DevPro
        </footer>
      </main>
    </div>
  );
}
