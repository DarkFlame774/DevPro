"use client";

import { ProfileData } from "@devpro/types";

interface Props {
  profile: ProfileData;
  slug: string;
}

export default function MinimalTemplate({ profile, slug }: Props) {
  const { user, stats, featuredProjects, leetcode } = profile;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-stone-300">
      <main className="max-w-2xl mx-auto px-6 py-20">

        {/* ── Header ── */}
        <header className="mb-16">
          <div className="flex items-center gap-6 mb-6">
            {user.avatar_url && (
              <img
                src={user.avatar_url}
                alt={user.name || slug}
                className="w-20 h-20 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                {user.name || slug}
              </h1>
              {user.location && (
                <p className="text-sm text-stone-500 mt-1">{user.location}</p>
              )}
            </div>
          </div>
          <p className="text-stone-600 text-lg leading-relaxed">
            {user.bio || "Software Engineer & Open Source Contributor"}
          </p>
          <div className="mt-4 flex gap-6 text-sm text-stone-500">
            <span><strong className="text-stone-700">{stats.followers || 0}</strong> followers</span>
            <span><strong className="text-stone-700">{stats.total_stars || 0}</strong> stars</span>
          </div>
          <div className="mt-6 h-px bg-stone-200" />
        </header>

        {/* ── Languages ── */}
        <section className="mb-14">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-5">
            Languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.top_languages || {})
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 8)
              .map(([lang]) => (
                <span
                  key={lang}
                  className="px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 border border-stone-200 rounded-md"
                >
                  {lang}
                </span>
              ))}
          </div>
        </section>

        {/* ── LeetCode ── */}
        {leetcode && leetcode.profile && leetcode.submitStats && (
          <section className="mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-5">
              LeetCode
            </h2>
            <div className="flex gap-6">
              <div>
                <div className="text-2xl font-bold text-stone-800">{leetcode.profile.ranking || "—"}</div>
                <div className="text-xs text-stone-500 mt-0.5">Rank</div>
              </div>
              {leetcode.submitStats.acSubmissionNum?.map((stat: any) => (
                <div key={stat.difficulty}>
                  <div className={`text-2xl font-bold ${
                    stat.difficulty === "Easy" ? "text-emerald-600" :
                    stat.difficulty === "Medium" ? "text-amber-600" : "text-rose-600"
                  }`}>
                    {stat.count}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">{stat.difficulty}</div>
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
            {featuredProjects.map((repo: any) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="group block py-4 border-b border-stone-100 last:border-0 hover:bg-stone-100/50 -mx-3 px-3 rounded-lg transition-colors duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-stone-800 group-hover:text-stone-950 truncate">
                      {repo.name}
                    </h3>
                    <p className="text-sm text-stone-500 mt-1 line-clamp-1">
                      {repo.description || "No description provided."}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    {repo.language && (
                      <span className="text-xs text-stone-400">{repo.language}</span>
                    )}
                    <span className="text-sm text-stone-500 font-medium">★ {repo.stargazers_count}</span>
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
