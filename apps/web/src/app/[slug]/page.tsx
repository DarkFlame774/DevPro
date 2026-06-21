import { notFound } from "next/navigation";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch data from our backend
  const res = await fetch(`http://localhost:3001/api/profiles/${slug}`, {
    // Revalidate every 60 seconds (Incremental Static Regeneration)
    next: { revalidate: 60 } 
  });

  if (!res.ok) {
    if (res.status === 404 || res.status === 403) {
      notFound();
    }
    return <div className="text-white bg-red-900 p-8 text-center">Failed to load profile.</div>;
  }

  const profile = await res.json();
  const user = profile.user || {};
  const stats = profile.stats || {};
  const featuredProjects = profile.featuredProjects || [];
  const leetcode = profile.leetcode || null;

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 ${inter.className}`}>
      {/* Dynamic Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        
        {/* Header Section (Glassmorphism Card) */}
        <header className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center gap-8 shadow-2xl transition-transform hover:-translate-y-1 duration-300">
          {user.avatar_url && (
            <img 
              src={user.avatar_url} 
              alt={user.name || slug} 
              className="w-32 h-32 rounded-full border-4 border-indigo-500/30 object-cover"
            />
          )}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              {user.name || slug}
            </h1>
            <p className="text-xl text-slate-400 mt-2 font-medium">
              {user.bio || "Software Engineer & Open Source Contributor"}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-semibold">{stats.followers || 0} Followers</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-semibold">{stats.total_stars || 0} Total Stars</span>
            </div>
          </div>
        </header>

        {/* LeetCode & Top Languages Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Top Languages */}
          <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl hover:bg-white/10 transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-6 text-indigo-300">Top Languages</h2>
            <div className="space-y-4">
              {Object.entries(stats.top_languages || {})
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 5)
                .map(([lang, count]) => (
                  <div key={lang} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="font-medium text-slate-200">{lang}</span>
                    <span className="text-slate-400 text-sm">{count} repos</span>
                  </div>
                ))}
            </div>
          </section>

          {/* LeetCode Stats */}
          {leetcode && leetcode.profile && leetcode.submitStats ? (
            <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl hover:bg-white/10 transition-colors duration-300">
              <h2 className="text-2xl font-bold mb-6 text-yellow-400">LeetCode Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold text-white">{leetcode.profile.ranking || "N/A"}</div>
                  <div className="text-sm text-slate-400 mt-1">Global Rank</div>
                </div>
                {leetcode.submitStats.acSubmissionNum?.map((stat: any) => (
                  <div key={stat.difficulty} className="bg-black/20 p-4 rounded-xl text-center">
                    <div className={`text-2xl font-bold ${
                      stat.difficulty === 'Easy' ? 'text-green-400' :
                      stat.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {stat.count}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">{stat.difficulty}</div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
             <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl flex items-center justify-center">
                <p className="text-slate-500 italic">LeetCode not connected</p>
             </section>
          )}

        </div>

        {/* Top Repositories */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-cyan-300">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((repo: any) => (
                <a 
                  key={repo.id} 
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-indigo-500/20"
                >
                  <h3 className="text-xl font-bold text-indigo-300 group-hover:text-indigo-200 truncate">{repo.name}</h3>
                  <p className="text-slate-400 text-sm mt-2 line-clamp-2 min-h-[2.5rem]">
                    {repo.description || "No description provided."}
                  </p>
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1 text-yellow-400 font-medium">
                      ★ {repo.stargazers_count}
                    </span>
                    {repo.language && (
                      <span className="text-slate-300">{repo.language}</span>
                    )}
                  </div>
                </a>
              ))}
          </div>
        </section>

      </main>
    </div>
  );
}
