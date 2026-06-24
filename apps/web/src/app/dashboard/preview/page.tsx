"use client";

import { useEffect, useState } from "react";

export default function PreviewPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [slug, setSlug] = useState("");
  const [savedSlug, setSavedSlug] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchStatus = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/dashboard/status`, { credentials: "include" });
    const data = await res.json();
    setStatus(data);
    if (data.profile) {
      setSlug(data.profile.slug || "");
      setSavedSlug(data.profile.slug || "");
      setIsPublic(data.profile.isPublic || false);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleSaveSettings = async () => {
    setMessage("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/profiles/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          slug,
          isPublic,
          template: status?.profile?.template || "professional",
          accentColor: status?.profile?.accentColor || "blue",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Settings saved!");
      fetchStatus();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleGenerate = async () => {
    setMessage("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/profiles/generate`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage("Profile snapshot regenerated!");
      fetchStatus();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const copyUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    navigator.clipboard.writeText(`${origin}/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  const profile = status?.profile;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const publicUrl = savedSlug ? `${origin}/${savedSlug}` : null;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Preview & Publish</h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Configure your public URL and preview your portfolio</p>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
          message.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
        }`}>
          {message}
        </div>
      )}

      {/* Settings Bar */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Slug */}
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Public URL</label>
            <div className="flex items-center">
              <span className="text-sm text-slate-400 dark:text-slate-500 mr-1">{typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="your-slug"
                className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Public Toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{isPublic ? "Public" : "Private"}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleGenerate}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Regenerate
            </button>
          </div>
        </div>

        {/* Public URL Display */}
        {publicUrl && isPublic && (
          <div className="mt-4 flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-sm text-slate-500 dark:text-slate-400">Your profile is live at:</span>
            <a href={publicUrl} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              {publicUrl}
            </a>
            <button
              onClick={copyUrl}
              className="ml-auto text-xs px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>

      {/* Live Preview */}
      {publicUrl && profile?.hasSnapshot ? (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-2 font-mono">{publicUrl}</span>
          </div>
          <iframe
            src={publicUrl}
            className="w-full h-[600px] border-0 bg-white"
            title="Profile Preview"
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-16 text-center">
          <p className="text-slate-400 text-sm">
            {!slug ? "Enter a slug above to set your public URL" :
             !profile?.hasSnapshot ? "Click 'Regenerate' to create your profile snapshot" :
             "Your profile preview will appear here"}
          </p>
        </div>
      )}
    </div>
  );
}
