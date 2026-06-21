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
    const res = await fetch("http://localhost:3001/api/dashboard/status", { credentials: "include" });
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
      const res = await fetch("http://localhost:3001/api/profiles/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          slug,
          isPublic,
          template: status?.profile?.template || "professional",
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
      const res = await fetch("http://localhost:3001/api/profiles/generate", {
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
    navigator.clipboard.writeText(`http://localhost:3000/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  const profile = status?.profile;
  const publicUrl = savedSlug ? `http://localhost:3000/${savedSlug}` : null;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Preview & Publish</h1>
      <p className="text-gray-500 text-sm mb-8">Configure your public URL and preview your portfolio</p>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
          message.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
        }`}>
          {message}
        </div>
      )}

      {/* Settings Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Slug */}
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Public URL</label>
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-1">localhost:3000/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="your-slug"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
            <span className="text-sm text-gray-700 font-medium">{isPublic ? "Public" : "Private"}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
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
          <div className="mt-4 flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-lg">
            <span className="text-sm text-gray-500">Your profile is live at:</span>
            <a href={publicUrl} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 font-medium hover:underline">
              {publicUrl}
            </a>
            <button
              onClick={copyUrl}
              className="ml-auto text-xs px-2.5 py-1 bg-white border border-gray-200 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>

      {/* Live Preview */}
      {publicUrl && profile?.hasSnapshot ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-gray-400 ml-2">{publicUrl}</span>
          </div>
          <iframe
            src={publicUrl}
            className="w-full h-[600px] border-0"
            title="Profile Preview"
          />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <p className="text-gray-400 text-sm">
            {!slug ? "Enter a slug above to set your public URL" :
             !profile?.hasSnapshot ? "Click 'Regenerate' to create your profile snapshot" :
             "Your profile preview will appear here"}
          </p>
        </div>
      )}
    </div>
  );
}
