"use client";

import { useEffect, useState } from "react";
import { CanonicalProfile } from "@devpro/types";

export default function ProfileEditor() {
  const [profile, setProfile] = useState<CanonicalProfile | null>(null);
  const [overrides, setOverrides] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/profiles/me`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setProfile(data.evidence);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOverrides = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/overrides`, { credentials: "include" });
      const data = await res.json();
      const identityOverride = data.overrides?.find((o: any) => o.entity_type === 'identity' && o.entity_id === 'profile');
      if (identityOverride) {
        setOverrides(identityOverride.override_data);
      } else {
        setOverrides({});
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchProfile(), fetchOverrides()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (field: string, value: string) => {
    setMessage("");
    const newOverrides = { ...overrides, [field]: value };
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/overrides/identity/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ override_data: newOverrides })
      });
      if (!res.ok) throw new Error("Failed to save override");
      setOverrides(newOverrides);
      setMessage(`Saved ${field} override successfully.`);
      await fetchProfile(); // refresh compiled profile
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleReset = async (field: string) => {
    setMessage("");
    const newOverrides = { ...overrides };
    delete newOverrides[field];
    
    try {
      if (Object.keys(newOverrides).length === 0) {
        // Delete entire override if empty
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/overrides/identity/profile`, {
          method: "DELETE",
          credentials: "include"
        });
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/overrides/identity/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ override_data: newOverrides })
        });
      }
      setOverrides(newOverrides);
      setMessage(`Reset ${field} to evidence.`);
      await fetchProfile(); // refresh compiled profile
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const OverrideField = ({ label, field, evidenceValue }: { label: string, field: string, evidenceValue: string | null }) => {
    const isOverridden = overrides[field] !== undefined;
    const [editValue, setEditValue] = useState(isOverridden ? overrides[field] : (evidenceValue || ""));

    // Sync state if it was cleared externally
    useEffect(() => {
      setEditValue(isOverridden ? overrides[field] : (evidenceValue || ""));
    }, [isOverridden, overrides[field], evidenceValue]);

    return (
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{label}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isOverridden ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
            {isOverridden ? 'User Override' : 'Evidence'}
          </span>
        </div>
        
        {!isOverridden && (
          <div className="mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Current Evidence:</p>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
              {evidenceValue || "None provided"}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            {isOverridden ? 'Edit Override' : 'Set Override'}
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={`Enter custom ${label.toLowerCase()}...`}
            />
            <button 
              onClick={() => handleSave(field, editValue)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Save
            </button>
            {isOverridden && (
              <button 
                onClick={() => handleReset(field)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="text-slate-500 dark:text-slate-400">Loading editor...</div>;
  if (!profile) return <div className="text-slate-500 dark:text-slate-400">No profile generated yet. Please generate a snapshot from the Overview tab.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Profile Editor</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your profile overrides. Overrides replace raw evidence directly in the compiler.</p>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
          message.startsWith("Error") ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400" : "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        <OverrideField label="Name" field="name" evidenceValue={profile.identity?.name || null} />
        <OverrideField label="Headline" field="headline" evidenceValue={profile.identity?.headline || null} />
        <OverrideField label="Bio" field="bio" evidenceValue={profile.identity?.bio || null} />
        <OverrideField label="Location" field="location" evidenceValue={profile.identity?.location || null} />
      </div>
    </div>
  );
}
