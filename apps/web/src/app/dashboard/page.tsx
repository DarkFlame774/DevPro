"use client";

import { useEffect, useState } from "react";

export default function DashboardHome() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/dashboard/status`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    setMessage("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/profiles/generate`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Profile snapshot generated successfully!");
      // Refresh status
      const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/dashboard/status`, { credentials: "include" });
      setStatus(await statusRes.json());
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="text-slate-500 dark:text-slate-400">Loading...</div>;

  const github = status?.connections?.github;
  const leetcode = status?.connections?.leetcode;
  const profile = status?.profile;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Dashboard</h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Welcome back, {status?.email || "Developer"}</p>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
          message.startsWith("Error") ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400" : "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400"
        }`}>
          {message}
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">GitHub</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              github ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
            }`}>
              {github ? "Connected" : "Not connected"}
            </span>
          </div>
          {github && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              @{github.username} · Last sync: {github.lastSyncAt ? new Date(github.lastSyncAt).toLocaleDateString() : "Never"}
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">LeetCode</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              leetcode ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
            }`}>
              {leetcode ? "Connected" : "Not connected"}
            </span>
          </div>
          {leetcode && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              @{leetcode.username} · Last sync: {leetcode.lastSyncAt ? new Date(leetcode.lastSyncAt).toLocaleDateString() : "Never"}
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Profile</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              profile?.isPublic ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
            }`}>
              {profile?.isPublic ? "Public" : "Private"}
            </span>
          </div>
          {profile ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <p>Template: <span className="capitalize text-slate-700 dark:text-slate-300">{profile.template}</span></p>
              {profile.slug && profile.isPublic && (
                <a
                  href={`/${profile.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline mt-1 inline-block"
                >
                  View live →
                </a>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">Not configured yet</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm mt-8">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 hover:shadow-md transition-all duration-200"
          >
            Generate Snapshot
          </button>
          <a
            href="/dashboard/connections"
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
          >
            Manage Connections
          </a>
          <a
            href="/dashboard/templates"
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
          >
            Change Template
          </a>
        </div>
      </div>
    </div>
  );
}
