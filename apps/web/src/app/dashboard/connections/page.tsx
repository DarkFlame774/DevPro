"use client";

import { useEffect, useState } from "react";

export default function ConnectionsPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");

  const fetchStatus = async () => {
    const res = await fetch("http://localhost:3001/api/dashboard/status", { credentials: "include" });
    const data = await res.json();
    setStatus(data);
    setLoading(false);
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleSyncGitHub = async () => {
    setMessage(""); setError("");
    try {
      const res = await fetch("http://localhost:3001/api/sync/github", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("GitHub data synced successfully!");
      fetchStatus();
    } catch (err: any) { setError(err.message); }
  };

  const handleLinkLeetCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(""); setError("");
    try {
      const res = await fetch("http://localhost:3001/api/connections/leetcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: leetcodeUsername }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("LeetCode account linked!");
      setLeetcodeUsername("");
      fetchStatus();
    } catch (err: any) { setError(err.message); }
  };

  const handleSyncLeetCode = async () => {
    setMessage(""); setError("");
    try {
      const res = await fetch("http://localhost:3001/api/sync/leetcode", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("LeetCode data synced successfully!");
      fetchStatus();
    } catch (err: any) { setError(err.message); }
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  const github = status?.connections?.github;
  const leetcode = status?.connections?.leetcode;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Connections</h1>
      <p className="text-gray-500 text-sm mb-8">Manage your platform integrations</p>

      {message && <div className="mb-6 px-4 py-3 rounded-lg text-sm font-medium bg-green-50 text-green-700">{message}</div>}
      {error && <div className="mb-6 px-4 py-3 rounded-lg text-sm font-medium bg-red-50 text-red-700">{error}</div>}

      {/* GitHub */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white text-lg font-bold">G</div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">GitHub</h2>
              <p className="text-xs text-gray-400">Repositories, stars, and languages</p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            github ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}>
            {github ? "Connected" : "Not connected"}
          </span>
        </div>

        {github ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Username</span>
              <span className="text-gray-900 font-medium">@{github.username}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Last Synced</span>
              <span className="text-gray-700">{github.lastSyncAt ? new Date(github.lastSyncAt).toLocaleString() : "Never"}</span>
            </div>
            <button
              onClick={handleSyncGitHub}
              className="w-full mt-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sync Now
            </button>
          </div>
        ) : (
          <a
            href="http://localhost:3001/api/auth/github"
            className="block w-full text-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Connect GitHub
          </a>
        )}
      </div>

      {/* LeetCode */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white text-lg font-bold">L</div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">LeetCode</h2>
              <p className="text-xs text-gray-400">Problem solving stats and ranking</p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            leetcode ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}>
            {leetcode ? "Connected" : "Not connected"}
          </span>
        </div>

        {leetcode ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Username</span>
              <span className="text-gray-900 font-medium">@{leetcode.username}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Last Synced</span>
              <span className="text-gray-700">{leetcode.lastSyncAt ? new Date(leetcode.lastSyncAt).toLocaleString() : "Never"}</span>
            </div>
            <button
              onClick={handleSyncLeetCode}
              className="w-full mt-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
            >
              Sync Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleLinkLeetCode} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter LeetCode username"
              value={leetcodeUsername}
              onChange={(e) => setLeetcodeUsername(e.target.value)}
              required
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
            >
              Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
