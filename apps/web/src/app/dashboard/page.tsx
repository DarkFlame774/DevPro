"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("professional");

  // 1. Check Auth Status
  useEffect(() => {
    fetch("http://localhost:3001/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        // Redirect to login if not authenticated
        window.location.href = "/login";
      });
  }, []);

  // 2. Sync GitHub Data
  const handleSyncGitHub = async () => {
    setMessage("");
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/sync/github", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to sync GitHub");
      setMessage("GitHub data synchronized successfully! Check your database.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 3. Link LeetCode Account
  const handleLinkLeetCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/connections/leetcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: leetcodeUsername }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to link LeetCode");
      setMessage("LeetCode account linked! You can now sync your stats.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 4. Sync LeetCode Data
  const handleSyncLeetCode = async () => {
    setMessage("");
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/sync/leetcode", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to sync LeetCode");
      setMessage("LeetCode data synchronized successfully! Check your database.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 5. Update Profile Settings
  const handleProfileSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const formData = new FormData(e.currentTarget);
    const slug = formData.get("slug");
    const isPublic = formData.get("isPublic") === "on";

    try {
      const res = await fetch("http://localhost:3001/api/profiles/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ slug, isPublic, template: selectedTemplate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile settings");
      setMessage("Profile settings updated successfully!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 6. Generate Profile Snapshot
  const handleGenerateProfile = async () => {
    setMessage("");
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/profiles/generate", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate profile");
      setMessage("Profile Snapshot Generated! Your public portfolio is now live with the latest data.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Developer Dashboard</h1>
      <p>Welcome, {user.email || "Developer"}!</p>

      {message && <div style={{ padding: "1rem", background: "#d4edda", color: "#155724", marginBottom: "1rem" }}>{message}</div>}
      {error && <div style={{ padding: "1rem", background: "#f8d7da", color: "#721c24", marginBottom: "1rem" }}>{error}</div>}

      <div style={{ border: "1px solid #ddd", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem", background: "#f8f9fa" }}>
        <h2 style={{ color: "#007bff" }}>Step 3: Publish Your Portfolio</h2>
        <p>Once you have synced your data and set your slug below, click here to generate your public portfolio snapshot.</p>
        <button 
          onClick={handleGenerateProfile}
          style={{ padding: "0.75rem 1.5rem", background: "#28a745", color: "white", border: "none", cursor: "pointer", fontSize: "1.1rem", fontWeight: "bold", borderRadius: "4px" }}
        >
          Generate Profile Snapshot
        </button>
      </div>

      <div style={{ border: "1px solid #ddd", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h2>Profile Settings</h2>
        <p>Claim your public URL, choose a template, and set visibility.</p>
        <form onSubmit={handleProfileSettings} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Public URL (Slug)</label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>localhost:3000/</span>
              <input type="text" name="slug" placeholder="e.g. alice" required style={{ padding: "0.5rem", flex: 1 }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.75rem", fontWeight: "bold" }}>Template</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
              {[
                { id: "professional", name: "Professional", desc: "Dark, glassmorphism cards", color: "#6366f1" },
                { id: "minimal", name: "Minimal", desc: "Light, typography-focused", color: "#78716c" },
                { id: "terminal", name: "Terminal", desc: "CLI aesthetic, monospace", color: "#22c55e" },
              ].map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  style={{
                    padding: "1rem",
                    border: selectedTemplate === t.id ? `2px solid ${t.color}` : "2px solid #ddd",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: selectedTemplate === t.id ? `${t.color}10` : "white",
                    textAlign: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: "0.9rem", color: selectedTemplate === t.id ? t.color : "#333" }}>{t.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "4px" }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input type="checkbox" name="isPublic" id="isPublic" />
            <label htmlFor="isPublic">Make my profile public</label>
          </div>
          <button type="submit" style={{ padding: "0.5rem 1rem", background: "#007bff", color: "white", border: "none", cursor: "pointer", alignSelf: "flex-start" }}>Save Profile Settings</button>
        </form>
      </div>

      <div style={{ border: "1px solid #ddd", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h2>GitHub Integration</h2>
        <p>If you logged in with GitHub, your account is already connected.</p>
        <button 
          onClick={handleSyncGitHub}
          style={{ padding: "0.5rem 1rem", background: "#24292e", color: "white", border: "none", cursor: "pointer" }}
        >
          Sync GitHub Data
        </button>
      </div>

      <div style={{ border: "1px solid #ddd", padding: "1.5rem", borderRadius: "8px" }}>
        <h2>LeetCode Integration</h2>
        <p>Link your public LeetCode username to fetch your problem-solving stats.</p>
        
        <form onSubmit={handleLinkLeetCode} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <input 
            type="text" 
            placeholder="LeetCode Username" 
            value={leetcodeUsername}
            onChange={(e) => setLeetcodeUsername(e.target.value)}
            required
            style={{ padding: "0.5rem", flex: 1 }}
          />
          <button type="submit" style={{ padding: "0.5rem 1rem" }}>Link Account</button>
        </form>

        <button 
          onClick={handleSyncLeetCode}
          style={{ padding: "0.5rem 1rem", background: "#ffa116", color: "white", border: "none", cursor: "pointer" }}
        >
          Sync LeetCode Data
        </button>
      </div>
    </div>
  );
}
