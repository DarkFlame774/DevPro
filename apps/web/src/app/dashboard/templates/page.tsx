"use client";

import { useEffect, useState } from "react";

const templates = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean white design with accent colors, premium typography, and structured sections. Best for showcasing a polished portfolio.",
    color: "bg-indigo-600",
    preview: "bg-white",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, light-mode, typography-focused layout. Elegant whitespace and structured hierarchy. Feels like a modern resume.",
    color: "bg-stone-500",
    preview: "bg-stone-50",
  },
  {
    id: "terminal",
    name: "Terminal",
    description: "Monospace CLI aesthetic with command-output formatting. Fun, developer-centric, and instantly recognizable.",
    color: "bg-emerald-600",
    preview: "bg-gray-950",
  },
];

const accentColors = [
  { id: "blue", name: "Blue", bg: "bg-blue-500", ring: "ring-blue-300" },
  { id: "purple", name: "Purple", bg: "bg-purple-500", ring: "ring-purple-300" },
  { id: "emerald", name: "Emerald", bg: "bg-emerald-500", ring: "ring-emerald-300" },
];

export default function TemplatesPage() {
  const [current, setCurrent] = useState("professional");
  const [accent, setAccent] = useState("blue");
  const [slug, setSlug] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/dashboard/status`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setCurrent(data.profile.template || "professional");
          setAccent(data.profile.accentColor || "blue");
          setSlug(data.profile.slug || "");
          setIsPublic(data.profile.isPublic || false);
        }
        setLoading(false);
      });
  }, []);

  const handleSelect = async (templateId: string, accentColor?: string) => {
    setCurrent(templateId);
    if (accentColor) setAccent(accentColor);
    setMessage("");

    const finalAccent = accentColor || accent;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/profiles/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slug, isPublic, template: templateId, accentColor: finalAccent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const genRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/profiles/generate`, {
        method: "POST",
        credentials: "include",
      });
      const genData = await genRes.json();
      if (!genRes.ok) throw new Error(genData.error);

      setMessage(`Switched to ${templateId}${templateId === "professional" ? ` (${finalAccent})` : ""} and regenerated your profile!`);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleAccentChange = (accentId: string) => {
    setAccent(accentId);
    handleSelect(current, accentId);
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Templates</h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Choose how your portfolio looks to the world</p>

      {message && <div className="mb-6 px-4 py-3 rounded-lg text-sm font-medium bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400">{message}</div>}

      <div className="grid md:grid-cols-3 gap-6">
        {templates.map((tpl) => {
          const isActive = current === tpl.id;
          return (
            <div 
              key={tpl.id}
              onClick={() => handleSelect(tpl.id)}
              className={`relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${
                isActive
                  ? "border-indigo-600 shadow-md ring-4 ring-indigo-50 dark:ring-indigo-900/20" 
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
              }`}
            >
              {isActive && (
                <div className="absolute top-3 right-3 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-10">
                  ✓
                </div>
              )}
              
              <div className={`h-40 ${tpl.color} flex items-center justify-center p-6 relative`}>
                <div className="w-full h-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-800/50 p-3 space-y-2">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-1 flex-1">
                      <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-2 w-1/4 bg-slate-100 dark:bg-slate-800/50 rounded" />
                    </div>
                  </div>
                  <div className="h-12 w-full bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800" />
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 h-full">
                <h3 className="font-semibold text-slate-900 dark:text-white">{tpl.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tpl.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accent Color Picker — only shown when Professional is selected */}
      {current === "professional" && (
        <div className="mt-8 p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Accent Color</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Choose the accent color for your Professional portfolio</p>
          <div className="flex gap-4">
            {accentColors.map((ac) => (
              <button
                key={ac.id}
                onClick={() => handleAccentChange(ac.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border-2 transition-all ${
                  accent === ac.id
                    ? `border-slate-900 dark:border-white ring-2 ${ac.ring} shadow-md`
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className={`w-5 h-5 rounded-full ${ac.bg} shadow-sm`} />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{ac.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
