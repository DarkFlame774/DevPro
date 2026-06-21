"use client";

import { useEffect, useState } from "react";

export default function DashboardHome() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/dashboard/status", { credentials: "include" })
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
      const res = await fetch("http://localhost:3001/api/profiles/generate", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Profile snapshot generated successfully!");
      // Refresh status
      const statusRes = await fetch("http://localhost:3001/api/dashboard/status", { credentials: "include" });
      setStatus(await statusRes.json());
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  const github = status?.connections?.github;
  const leetcode = status?.connections?.leetcode;
  const profile = status?.profile;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Welcome back, {status?.email || "Developer"}</p>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
          message.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
        }`}>
          {message}
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* GitHub */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">GitHub</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              github ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}>
              {github ? "Connected" : "Not connected"}
            </span>
          </div>
          {github && (
            <p className="text-xs text-gray-400">
              @{github.username} · Last sync: {github.lastSyncAt ? new Date(github.lastSyncAt).toLocaleDateString() : "Never"}
            </p>
          )}
        </div>

        {/* LeetCode */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">LeetCode</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              leetcode ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}>
              {leetcode ? "Connected" : "Not connected"}
            </span>
          </div>
          {leetcode && (
            <p className="text-xs text-gray-400">
              @{leetcode.username} · Last sync: {leetcode.lastSyncAt ? new Date(leetcode.lastSyncAt).toLocaleDateString() : "Never"}
            </p>
          )}
        </div>

        {/* Profile */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Profile</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              profile?.isPublic ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"
            }`}>
              {profile?.isPublic ? "Public" : "Private"}
            </span>
          </div>
          {profile ? (
            <div className="text-xs text-gray-400">
              <p>Template: <span className="capitalize text-gray-600">{profile.template}</span></p>
              {profile.slug && profile.isPublic && (
                <a
                  href={`http://localhost:3000/${profile.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline mt-1 inline-block"
                >
                  View live →
                </a>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Not configured yet</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Generate Snapshot
          </button>
          <a
            href="/dashboard/connections"
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Manage Connections
          </a>
          <a
            href="/dashboard/templates"
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Change Template
          </a>
        </div>
      </div>
    </div>
  );
}
