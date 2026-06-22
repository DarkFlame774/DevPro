"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax tilt effect state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Quick check if user has an active session
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/auth/me`, { credentials: "include" })
      .then((res) => {
        if (res.ok) setIsLoggedIn(true);
      })
      .catch(() => {});
      
    // Auto-cycle tabs in the preview
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the center of the container
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Convert to rotation degrees (max 5 degrees)
    const rotateX = -(y / (rect.height / 2)) * 5;
    const rotateY = (x / (rect.width / 2)) * 5;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
      <div className="absolute top-40 -right-40 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '6s', animationDelay: '1s' }} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tight">
            Dev<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={async () => {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/auth/logout`, { method: "POST", credentials: "include" });
                    setIsLoggedIn(false);
                    window.location.reload();
                  }}
                  className="px-5 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-full hover:bg-slate-800 dark:hover:bg-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium mb-4 shadow-sm backdrop-blur-md">
            Your portfolio, on autopilot.
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            The developer portfolio <br className="hidden md:block" />
            that <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">builds itself.</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            Connect your GitHub and LeetCode accounts. Choose a premium template. 
            We automatically sync your stats, top projects, and languages into a stunning public profile.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="px-8 py-4 text-base font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              {isLoggedIn ? "Open Dashboard" : "Get Started for Free"}
            </Link>
            <a
              href="#features"
              className="px-8 py-4 text-base font-medium text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-white dark:hover:bg-slate-800 backdrop-blur-sm transition-all hover:shadow-sm"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Interactive Interactive App Preview */}
        <div 
          className="max-w-5xl mx-auto mt-32 relative perspective-1000"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-900 h-full w-full pointer-events-none" />
          
          <div 
            className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden relative z-0 transition-transform duration-300 ease-out will-change-transform"
            style={{ 
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(0.98)` 
            }}
          >
            {/* Mockup Window Header */}
            <div className="h-12 bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300 hover:bg-rose-400 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-slate-300 hover:bg-amber-400 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-slate-300 hover:bg-emerald-400 transition-colors" />
              </div>
              
              {/* Interactive Tabs */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTab(0)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 0 ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  1. Syncing Data
                </button>
                <button 
                  onClick={() => setActiveTab(1)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 1 ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  2. Building Profile
                </button>
                <button 
                  onClick={() => setActiveTab(2)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 2 ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  3. Live Result
                </button>
              </div>
              <div className="w-12" /> {/* Spacer for centering */}
            </div>

            {/* Mockup Content Area */}
            <div className="h-[400px] w-full bg-white relative overflow-hidden">
              
              {/* Tab 0: Terminal Syncing */}
              <div className={`absolute inset-0 p-8 bg-slate-900 text-emerald-400 font-mono text-sm transition-opacity duration-500 flex flex-col justify-end ${activeTab === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <div className="space-y-2">
                  <p className="opacity-50">&gt; Authenticating with GitHub API...</p>
                  <p className="opacity-50">&gt; Token accepted. Fetching user profile...</p>
                  <p className="opacity-75">&gt; Pulling repository metadata (100/100)...</p>
                  <p className="opacity-75">&gt; Aggregating language statistics...</p>
                  <p className="opacity-75">&gt; Fetching LeetCode global ranking...</p>
                  <p className="text-white animate-pulse">&gt; Sync complete. Normalizing data payload...</p>
                </div>
              </div>

              {/* Tab 1: Building (Wireframe Skeleton) */}
              <div className={`absolute inset-0 p-8 grid grid-cols-3 gap-6 transition-opacity duration-500 ${activeTab === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <div className="col-span-1 space-y-4">
                  <div className="h-32 bg-indigo-50 border border-indigo-100 rounded-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                  </div>
                  <div className="h-64 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 translate-x-[-100%] animate-[shimmer_2s_infinite_0.5s]" />
                  </div>
                </div>
                <div className="col-span-2 space-y-4">
                  <div className="h-48 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 translate-x-[-100%] animate-[shimmer_2s_infinite_0.2s]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-40 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                    </div>
                    <div className="h-40 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 translate-x-[-100%] animate-[shimmer_2s_infinite_0.7s]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab 2: Live Rendered Profile */}
              <div className={`absolute inset-0 p-8 bg-slate-50 transition-opacity duration-500 ${activeTab === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <div className="max-w-3xl mx-auto flex gap-8">
                  <div className="w-1/3 space-y-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
                      <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-full mb-4" />
                      <div className="h-4 w-3/4 bg-slate-800 rounded mb-2" />
                      <div className="h-3 w-1/2 bg-slate-400 rounded" />
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                      <div className="flex gap-2 flex-wrap">
                        <div className="h-6 w-16 bg-blue-100 rounded-full" />
                        <div className="h-6 w-20 bg-amber-100 rounded-full" />
                        <div className="h-6 w-14 bg-rose-100 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="w-2/3 space-y-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                      <div className="h-5 w-1/3 bg-slate-800 rounded mb-6" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-200 transition-colors">
                          <div className="h-3 w-1/2 bg-indigo-600 rounded" />
                          <div className="h-2 w-full bg-slate-200 rounded" />
                        </div>
                        <div className="h-24 bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-200 transition-colors">
                          <div className="h-3 w-2/3 bg-indigo-600 rounded" />
                          <div className="h-2 w-3/4 bg-slate-200 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-6xl mx-auto py-32 grid md:grid-cols-3 gap-16 text-center relative z-10">
          <div className="space-y-5 group cursor-default">
            <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:-translate-y-1 group-hover:shadow-md transition-all">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Zero Maintenance</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              Your profile updates automatically every time you push to GitHub or solve a LeetCode problem.
            </p>
          </div>
          <div className="space-y-5 group cursor-default">
            <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:-translate-y-1 group-hover:shadow-md transition-all">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Premium Templates</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              Switch between beautifully designed minimal themes with one click. No CSS knowledge required.
            </p>
          </div>
          <div className="space-y-5 group cursor-default">
            <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:-translate-y-1 group-hover:shadow-md transition-all">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Data-Driven</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              We algorithmically select your best projects based on stars, forks, and recent activity.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 py-12 text-center text-slate-400 dark:text-slate-500 text-sm font-light relative z-10">
        <p>© 2026 DevPro. Crafted for developers.</p>
      </footer>
    </div>
  );
}
