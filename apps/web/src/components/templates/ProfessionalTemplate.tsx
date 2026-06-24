"use client";

import { CanonicalProfile, AccentColor, CanonicalLanguage } from "@devpro/types";

interface Props {
  profile: CanonicalProfile;
  slug: string;
}

/* ── Accent Color Tokens ── */
const accents: Record<AccentColor, {
  primary: string;       // text color
  bg: string;            // light background fill
  border: string;        // border color
  gradient: string;      // gradient from-to
  badge: string;         // small badge bg
  hoverBorder: string;   // hover state
  dot: string;           // section dot
}> = {
  blue: {
    primary: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    gradient: "from-blue-600 to-cyan-500",
    badge: "bg-blue-100 text-blue-700",
    hoverBorder: "hover:border-blue-400",
    dot: "bg-blue-500",
  },
  purple: {
    primary: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    gradient: "from-purple-600 to-fuchsia-500",
    badge: "bg-purple-100 text-purple-700",
    hoverBorder: "hover:border-purple-400",
    dot: "bg-purple-500",
  },
  emerald: {
    primary: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    gradient: "from-emerald-600 to-teal-500",
    badge: "bg-emerald-100 text-emerald-700",
    hoverBorder: "hover:border-emerald-400",
    dot: "bg-emerald-500",
  },
};

/* ── Tech Stack Category Helper ── */
const LANGUAGE_CATEGORIES: Record<string, string[]> = {
  "Frontend": ["JavaScript", "TypeScript", "HTML", "CSS", "Sass", "SCSS", "Vue", "Svelte", "Dart"],
  "Backend": ["Python", "Java", "Go", "Ruby", "PHP", "C#", "Rust", "Elixir", "Kotlin", "Scala", "Perl"],
  "Systems": ["C", "C++", "Assembly", "Zig", "Nim"],
  "Data & ML": ["Jupyter Notebook", "R", "Julia", "MATLAB"],
  "Mobile": ["Swift", "Objective-C", "Dart", "Kotlin"],
  "DevOps & Config": ["Shell", "Dockerfile", "HCL", "Makefile", "Nix", "PowerShell"],
  "Other": [],
};

function categorizeLangs(languages: CanonicalLanguage[]): Record<string, CanonicalLanguage[]> {
  const result: Record<string, CanonicalLanguage[]> = {};
  languages.forEach(lang => {
    // Basic auto-categorization for demonstration if not provided
    let cat = lang.category || "Other";
    if (!lang.category) {
      for (const [key, list] of Object.entries(LANGUAGE_CATEGORIES)) {
        if (list.includes(lang.name)) cat = key;
      }
    }
    if (!result[cat]) result[cat] = [];
    result[cat].push(lang);
  });
  return result;
}

export default function ProfessionalTemplate({ profile, slug }: Props) {
  const { metadata, identity, activity, projects, technicalFocus, developerSignals } = profile;
  const accentKey: AccentColor = metadata.accentColor || "blue";
  const a = accents[accentKey];

  const techStack = categorizeLangs(technicalFocus.languages || []);

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Satoshi:wght@500;700;900&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-blue-100"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <main className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24">

          {/* ══════════════════════════════════════════
              SECTION 1: HERO
          ══════════════════════════════════════════ */}
          <header className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-24">
            {/* Photo */}
            {identity.avatarUrl && (
              <img
                src={identity.avatarUrl}
                alt={identity.name || slug}
                className="w-40 h-40 md:w-44 md:h-44 rounded-2xl object-cover shadow-lg border-4 border-white ring-1 ring-slate-200"
              />
            )}

            {/* Info */}
            <div className="text-center md:text-left flex-1 space-y-5">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                {identity.name || slug}
              </h1>

              <p className="text-lg md:text-xl text-slate-500 max-w-xl leading-relaxed">
                {identity.bio || identity.headline || "Software Engineer"}
              </p>

              {identity.location && (
                <p className="text-sm text-slate-400 flex items-center justify-center md:justify-start gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {identity.location}
                </p>
              )}

              {/* Stats Badges */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                {activity.contributionSummary.map((ev, i) => (
                  <span key={i} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${a.badge}`}>
                    {ev.value} {ev.label}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* ══════════════════════════════════════════
              SECTION 2: TECH STACK
          ══════════════════════════════════════════ */}
          <section className="mb-24">
            <div className="flex items-center gap-3 mb-10">
              <span className={`w-2.5 h-2.5 rounded-full ${a.dot}`} />
              <h2
                className="text-2xl md:text-3xl font-bold text-slate-900"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                Tech Stack
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries(techStack).map(([category, langs]) => (
                <div
                  key={category}
                  className={`bg-white rounded-xl border ${a.border} p-6 shadow-sm hover:shadow-md transition-shadow duration-300`}
                >
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${a.primary} mb-4`}>
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {langs.map((lang) => (
                      <span
                        key={lang.name}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${a.bg} ${a.primary}`}
                      >
                        {lang.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════
              SECTION 3: FEATURED PROJECTS
          ══════════════════════════════════════════ */}
          <section className="mb-24">
            <div className="flex items-center gap-3 mb-10">
              <span className={`w-2.5 h-2.5 rounded-full ${a.dot}`} />
              <h2
                className="text-2xl md:text-3xl font-bold text-slate-900"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                Featured Projects
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <a
                  key={proj.id}
                  href={proj.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`group block bg-white rounded-xl border border-slate-200 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${a.hoverBorder}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-lg font-bold text-slate-900 group-hover:text-slate-700 truncate flex-1 mr-2"
                      style={{ fontFamily: "'Satoshi', sans-serif" }}
                    >
                      {proj.title}
                    </h3>
                    <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0 mt-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>

                  <p className="text-slate-500 text-sm line-clamp-2 min-h-[2.5rem] leading-relaxed">
                    {proj.description || "No description provided."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 text-sm">
                    {proj.evidence.map((ev, i) => (
                      <span key={i} className={`text-xs px-2.5 py-1 rounded-full font-medium ${a.badge}`}>
                        {ev.label}: {ev.value}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════
              SECTION 4: DEVELOPER SIGNALS
          ══════════════════════════════════════════ */}
          {developerSignals.length > 0 && (
            <section className="mb-24">
              <div className="flex items-center gap-3 mb-10">
                <span className={`w-2.5 h-2.5 rounded-full ${a.dot}`} />
                <h2
                  className="text-2xl md:text-3xl font-bold text-slate-900"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  Developer Signals
                </h2>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {developerSignals.map((signal, idx) => (
                    <div key={idx} className={`${a.bg} border ${a.border} p-5 rounded-xl text-center`}>
                      <div className={`text-xl font-black ${a.primary} mb-2`}>{signal.observations[0]}</div>
                      {signal.evidence.map((ev, i) => (
                        <div key={i} className="text-sm text-slate-500 font-medium">
                          {ev.label}: <span className="font-bold text-slate-700">{ev.value}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════
              SECTION 5: ACHIEVEMENTS
          ══════════════════════════════════════════ */}
          <section className="mb-24">
            <div className="flex items-center gap-3 mb-10">
              <span className={`w-2.5 h-2.5 rounded-full ${a.dot}`} />
              <h2
                className="text-2xl md:text-3xl font-bold text-slate-900"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                Results & Achievements
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {activity.contributionSummary.map((ev, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm">
                  <div className={`text-3xl font-black ${a.primary}`}>{ev.value}</div>
                  <div className="text-xs text-slate-500 mt-2 font-semibold uppercase tracking-wider">{ev.label}</div>
                </div>
              ))}
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm">
                <div className={`text-3xl font-black ${a.primary}`}>{projects.length}</div>
                <div className="text-xs text-slate-500 mt-2 font-semibold uppercase tracking-wider">Top Projects</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm">
                <div className={`text-3xl font-black ${a.primary}`}>{technicalFocus.languages.length}</div>
                <div className="text-xs text-slate-500 mt-2 font-semibold uppercase tracking-wider">Languages</div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              SECTION 6: TESTIMONIALS (placeholder)
          ══════════════════════════════════════════ */}
          <section className="mb-24">
            <div className="flex items-center gap-3 mb-10">
              <span className={`w-2.5 h-2.5 rounded-full ${a.dot}`} />
              <h2
                className="text-2xl md:text-3xl font-bold text-slate-900"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                Testimonials
              </h2>
            </div>

            <div className={`bg-white rounded-xl border border-dashed ${a.border} p-12 text-center shadow-sm`}>
              <p className="text-slate-400 text-sm italic">Testimonials coming soon.</p>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              SECTION 7: CONTACT
          ══════════════════════════════════════════ */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-10">
              <span className={`w-2.5 h-2.5 rounded-full ${a.dot}`} />
              <h2
                className="text-2xl md:text-3xl font-bold text-slate-900"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                Get In Touch
              </h2>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-slate-600 text-lg leading-relaxed max-w-md">
                  Interested in working together or have a question? Let&apos;s connect.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://github.com/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${a.gradient} text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  GitHub Profile
                </a>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              FOOTER
          ══════════════════════════════════════════ */}
          <footer className="pt-10 border-t border-slate-200 text-center">
            <p className="text-slate-400 text-sm">
              Built with <span className={`font-semibold ${a.primary}`}>DevPro</span>
            </p>
          </footer>

        </main>
      </div>
    </>
  );
}
