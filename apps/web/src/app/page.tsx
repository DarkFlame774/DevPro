"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Quick check if user has an active session
    fetch("http://localhost:3001/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) setIsLoggedIn(true);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tight">
            Dev<span className="text-indigo-600">Pro</span>
          </div>
          <div className="flex gap-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-4">
            ✨ Your portfolio, on autopilot.
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
            The developer portfolio <br className="hidden md:block" />
            that <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">builds itself.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Connect your GitHub and LeetCode accounts. Choose a premium template. 
            We automatically sync your stats, top projects, and languages into a stunning public profile.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="px-8 py-4 text-base font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started for Free
            </Link>
            <a
              href="#features"
              className="px-8 py-4 text-base font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Decorative App Preview */}
        <div className="max-w-6xl mx-auto mt-24 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent z-10 h-full w-full pointer-events-none" />
          <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden transform perspective-1000 rotate-x-12 scale-95 origin-top relative z-0">
            <div className="h-12 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="p-8 grid grid-cols-3 gap-6 opacity-80">
              <div className="col-span-1 space-y-4">
                <div className="h-32 bg-slate-100 rounded-xl" />
                <div className="h-64 bg-slate-100 rounded-xl" />
              </div>
              <div className="col-span-2 space-y-4">
                <div className="h-48 bg-slate-100 rounded-xl" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-40 bg-slate-100 rounded-xl" />
                  <div className="h-40 bg-slate-100 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-7xl mx-auto py-24 grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">
              ⚡️
            </div>
            <h3 className="text-xl font-bold text-slate-900">Zero Maintenance</h3>
            <p className="text-slate-500">
              Your profile updates automatically every time you push to GitHub or solve a LeetCode problem.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center text-2xl">
              🎨
            </div>
            <h3 className="text-xl font-bold text-slate-900">Premium Templates</h3>
            <p className="text-slate-500">
              Switch between beautifully designed themes with one click. No CSS knowledge required.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl">
              📊
            </div>
            <h3 className="text-xl font-bold text-slate-900">Data-Driven</h3>
            <p className="text-slate-500">
              We algorithmically select your best projects based on stars, forks, and recent activity.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 text-center text-slate-500 text-sm">
        <p>© 2026 DevPro. Built for developers.</p>
      </footer>
    </div>
  );
}
