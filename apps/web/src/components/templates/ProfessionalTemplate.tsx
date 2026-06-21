"use client";

import { ProfileData } from "@devpro/types";

interface Props {
  profile: ProfileData;
  slug: string;
}

export default function ProfessionalTemplate({ profile, slug }: Props) {
  const { user, stats, featuredProjects, leetcode } = profile;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Ambient background glow */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[35%] h-[35%] rounded-full bg-cyan-600/15 blur-[120px]" />
        <div className="absolute top-[50%] left-[60%] w-[25%] h-[25%] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20">

        {/* ── Hero Card ── */}
        <header className="backdrop-blur-lg bg-white/[0.04] border border-white/[0.08] rounded-3xl p-10 mb-14 flex flex-col md:flex-row items-center gap-10 shadow-2xl">
          {user.avatar_url && (
            <img
              src={user.avatar_url}
              alt={user.name || slug}
              className="w-36 h-36 rounded-2xl border-2 border-white/10 object-cover shadow-lg"
            />
          )}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {user.name || slug}
            </h1>
            <p className="text-lg text-slate-400 mt-3 max-w-xl leading-relaxed">
              {user.bio || "Software Engineer & Open Source Contributor"}
            </p>
            {user.location && (
              <p className="text-sm text-slate-500 mt-2">📍 {user.location}</p>
            )}
            <div className="mt-5 flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="px-4 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-sm font-medium text-slate-300">
                {stats.followers || 0} Followers
              </span>
              <span className="px-4 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-sm font-medium text-slate-300">
                ★ {stats.total_stars || 0} Stars
              </span>
            </div>
          </div>
        </header>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">

          {/* Top Languages */}
          <section className="backdrop-blur-lg bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
              Top Languages
            </h2>
            <div className="space-y-3">
              {Object.entries(stats.top_languages || {})
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 5)
                .map(([lang, count]) => {
                  const maxCount = Math.max(...Object.values(stats.top_languages || {}).map(Number));
                  const pct = maxCount > 0 ? ((count as number) / maxCount) * 100 : 0;
                  return (
                    <div key={lang}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-slate-200 text-sm">{lang}</span>
                        <span className="text-slate-500 text-xs">{count as number} repos</span>
                      </div>
                      <div className="w-full bg-white/[0.06] rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* LeetCode Stats */}
          {leetcode && leetcode.profile && leetcode.submitStats ? (
            <section className="backdrop-blur-lg bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-6 text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                LeetCode
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.04] border border-white/[0.06] p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-white">{leetcode.profile.ranking || "N/A"}</div>
                  <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Rank</div>
                </div>
                {leetcode.submitStats.acSubmissionNum?.map((stat: any) => (
                  <div key={stat.difficulty} className="bg-white/[0.04] border border-white/[0.06] p-4 rounded-xl text-center">
                    <div className={`text-2xl font-bold ${
                      stat.difficulty === "Easy" ? "text-emerald-400" :
                      stat.difficulty === "Medium" ? "text-amber-400" : "text-rose-400"
                    }`}>
                      {stat.count}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{stat.difficulty}</div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="backdrop-blur-lg bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 shadow-xl flex items-center justify-center">
              <p className="text-slate-600 italic text-sm">LeetCode not connected</p>
            </section>
          )}
        </div>

        {/* ── Featured Projects ── */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProjects.map((repo: any) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="group block backdrop-blur-lg bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.07] hover:border-indigo-500/20 hover:shadow-indigo-500/10"
              >
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 truncate transition-colors duration-200">
                  {repo.name}
                </h3>
                <p className="text-slate-500 text-sm mt-2 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                  {repo.description || "No description provided."}
                </p>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1 text-amber-400/80 font-medium">
                    ★ {repo.stargazers_count}
                  </span>
                  {repo.language && (
                    <span className="text-slate-500 text-xs px-2 py-0.5 bg-white/[0.06] rounded-full">
                      {repo.language}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="mt-20 pt-8 border-t border-white/[0.06] text-center text-slate-600 text-sm">
          Built with DevPro
        </footer>
      </main>
    </div>
  );
}
