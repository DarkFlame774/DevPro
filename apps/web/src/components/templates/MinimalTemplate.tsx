"use client";

import { CanonicalProfile } from "@devpro/types";

interface Props {
  profile: CanonicalProfile;
  slug: string;
}

export default function MinimalTemplate({ profile, slug }: Props) {
  const { 
    identity = {} as any, 
    activity = { contributionSummary: [] }, 
    projects = [], 
    technicalFocus = { languages: [], technologies: [] }, 
    developerSignals = [] 
  } = profile || {};

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-stone-300">
      <main className="max-w-2xl mx-auto px-6 py-20">

        {/* ── Header ── */}
        <header className="mb-16">
          <div className="flex items-center gap-6 mb-6">
            {identity.avatarUrl && (
              <img
                src={identity.avatarUrl}
                alt={identity.name || slug}
                className="w-20 h-20 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                {identity.name || slug}
              </h1>
              {identity.location && (
                <p className="text-sm text-stone-500 mt-1">{identity.location}</p>
              )}
            </div>
          </div>
          <p className="text-stone-600 text-lg leading-relaxed">
            {identity.bio || identity.headline || "Software Engineer & Open Source Contributor"}
          </p>
          <div className="mt-4 flex gap-6 text-sm text-stone-500">
            {activity.contributionSummary.map((ev, i) => (
              <span key={i}><strong className="text-stone-700">{ev.value}</strong> {ev.label.toLowerCase()}</span>
            ))}
          </div>
          <div className="mt-6 h-px bg-stone-200" />
        </header>

        {/* ── Languages ── */}
        <section className="mb-14">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-5">
            Languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {technicalFocus.languages.map((lang) => (
              <span
                key={lang.name}
                className="px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 border border-stone-200 rounded-md"
              >
                {lang.name}
              </span>
            ))}
          </div>
        </section>

        {/* ── Developer Signals ── */}
        {developerSignals.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-5">
              Developer Signals
            </h2>
            <div className="flex flex-wrap gap-8">
              {developerSignals.map((signal, idx) => (
                <div key={idx}>
                  <div className="text-lg font-bold text-stone-800">{signal.observations[0]}</div>
                  {signal.evidence.map((ev, i) => (
                    <div key={i} className="text-sm text-stone-500 mt-0.5">
                      {ev.label}: <strong className="text-stone-700">{ev.value}</strong>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Projects ── */}
        <section className="mb-14">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-5">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((proj) => (
              <a
                key={proj.id}
                href={proj.url}
                target="_blank"
                rel="noreferrer"
                className="group block py-4 border-b border-stone-100 last:border-0 hover:bg-stone-100/50 -mx-3 px-3 rounded-lg transition-colors duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-stone-800 group-hover:text-stone-950 truncate">
                      {proj.title}
                    </h3>
                    <p className="text-sm text-stone-500 mt-1 line-clamp-1">
                      {proj.description || "No description provided."}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    {proj.evidence.map((ev, i) => (
                      <span key={i} className="text-xs text-stone-500 font-medium">
                        {ev.label}: {ev.value}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="pt-8 border-t border-stone-200 text-center text-stone-400 text-xs">
          Built with DevPro
        </footer>
      </main>
    </div>
  );
}
