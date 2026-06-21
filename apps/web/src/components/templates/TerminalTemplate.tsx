"use client";

import { ProfileData } from "@devpro/types";

interface Props {
  profile: ProfileData;
  slug: string;
}

export default function TerminalTemplate({ profile, slug }: Props) {
  const { user, stats, featuredProjects, leetcode } = profile;

  const topLangs = Object.entries(stats.top_languages || {})
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 6);

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
              {user.name || slug} — devpro
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
                {user.avatar_url && (
                  <img
                    src={user.avatar_url}
                    alt={user.name || slug}
                    className="w-14 h-14 rounded-lg border border-[#2a2a2a] object-cover"
                  />
                )}
                <div>
                  <div className="text-white text-lg font-bold">{user.name || slug}</div>
                  {user.location && <div className="text-[#666] text-xs mt-0.5">📍 {user.location}</div>}
                </div>
              </div>
              <div className="mt-2 text-[#999]">
                {user.bio || "Software Engineer & Open Source Contributor"}
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
  "followers": ${stats.followers || 0},
  "total_stars": ${stats.total_stars || 0},
  "public_repos": ${featuredProjects.length}+
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
                {topLangs.map(([lang, count]) => {
                  const maxCount = Math.max(...topLangs.map(([, c]) => c as number));
                  const barWidth = maxCount > 0 ? Math.round(((count as number) / maxCount) * 20) : 0;
                  return (
                    <div key={lang} className="flex items-center gap-3">
                      <span className="w-24 text-right text-[#888] text-xs">{lang}</span>
                      <span className="text-green-500 tracking-tighter">{"█".repeat(barWidth)}{"░".repeat(20 - barWidth)}</span>
                      <span className="text-[#555] text-xs">{count as number}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── LeetCode ── */}
            {leetcode && leetcode.profile && leetcode.submitStats && (
              <>
                <div className="border-t border-[#1a1a1a]" />
                <div>
                  <div className="text-green-400">
                    <span className="text-[#666]">$</span> leetcode --stats
                  </div>
                  <div className="mt-2 bg-[#111] border border-[#1e1e1e] rounded-lg p-4">
                    <div className="text-xs space-y-1">
                      <div><span className="text-[#666]">rank:</span> <span className="text-amber-400">{leetcode.profile.ranking || "N/A"}</span></div>
                      {leetcode.submitStats.acSubmissionNum?.map((stat: any) => (
                        <div key={stat.difficulty}>
                          <span className="text-[#666]">{stat.difficulty.toLowerCase().padEnd(8)}:</span>{" "}
                          <span className={
                            stat.difficulty === "Easy" ? "text-emerald-400" :
                            stat.difficulty === "Medium" ? "text-amber-400" : "text-rose-400"
                          }>
                            {stat.count} solved
                          </span>
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
                {featuredProjects.map((repo: any) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block bg-[#111] border border-[#1e1e1e] rounded-lg p-4 hover:border-green-900/50 hover:bg-[#141414] transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <span className="text-cyan-400 group-hover:text-cyan-300 font-bold text-sm">
                          {repo.name}
                        </span>
                        {repo.language && (
                          <span className="text-[#444] text-xs ml-2">[{repo.language}]</span>
                        )}
                        <p className="text-[#666] text-xs mt-1 line-clamp-1">
                          {repo.description || "No description."}
                        </p>
                      </div>
                      <span className="text-amber-400/70 text-xs ml-3 shrink-0">★{repo.stargazers_count}</span>
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
