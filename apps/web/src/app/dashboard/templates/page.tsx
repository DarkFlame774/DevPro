"use client";

import { useEffect, useState } from "react";

const templates = [
  {
    id: "professional",
    name: "Professional",
    description: "Dark mode with glassmorphism cards, gradient backgrounds, and hover animations. Best for showcasing a premium portfolio.",
    color: "#6366f1",
    preview: "bg-slate-900",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, light-mode, typography-focused layout. Elegant whitespace and structured hierarchy. Feels like a modern resume.",
    color: "#78716c",
    preview: "bg-stone-50",
  },
  {
    id: "terminal",
    name: "Terminal",
    description: "Monospace CLI aesthetic with command-output formatting. Fun, developer-centric, and instantly recognizable.",
    color: "#22c55e",
    preview: "bg-gray-950",
  },
];

export default function TemplatesPage() {
  const [current, setCurrent] = useState("professional");
  const [slug, setSlug] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/dashboard/status", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setCurrent(data.profile.template || "professional");
          setSlug(data.profile.slug || "");
          setIsPublic(data.profile.isPublic || false);
        }
        setLoading(false);
      });
  }, []);

  const handleSelect = async (templateId: string) => {
    setCurrent(templateId);
    setMessage("");
    try {
      // Save settings with the new template
      const res = await fetch("http://localhost:3001/api/profiles/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slug, isPublic, template: templateId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Auto-regenerate the snapshot
      const genRes = await fetch("http://localhost:3001/api/profiles/generate", {
        method: "POST",
        credentials: "include",
      });
      const genData = await genRes.json();
      if (!genRes.ok) throw new Error(genData.error);

      setMessage(`Switched to ${templateId} and regenerated your profile!`);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Templates</h1>
      <p className="text-gray-500 text-sm mb-8">Choose how your public portfolio looks</p>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
          message.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {templates.map((t) => {
          const isActive = current === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className={`w-full text-left bg-white border-2 rounded-xl p-6 transition-all duration-200 ${
                isActive
                  ? "border-indigo-500 shadow-md shadow-indigo-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-5">
                {/* Color preview swatch */}
                <div className={`w-16 h-16 rounded-lg shrink-0 ${t.preview} border border-gray-200`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900">{t.name}</h3>
                    {isActive && (
                      <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{t.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
