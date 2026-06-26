"use client";

import { useEffect, useState } from "react";

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/projects`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (e: any) {
      console.error(e);
      setMessage("Error loading projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (projectId: string, field: string, value: any, currentOverrides: any) => {
    setMessage("");
    const newOverrides = { ...currentOverrides, [field]: value };
    
    // Clean up empty strings
    if (newOverrides.title === "") delete newOverrides.title;
    if (newOverrides.description === "") delete newOverrides.description;

    try {
      if (Object.keys(newOverrides).length === 0) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/overrides/project/${encodeURIComponent(projectId)}`, {
          method: "DELETE",
          credentials: "include"
        });
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/overrides/project/${encodeURIComponent(projectId)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ override_data: newOverrides })
        });
      }
      
      setMessage(`Saved override for project.`);
      // Update local state optimistic
      setProjects(projects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            title: newOverrides.title || p.originalTitle,
            description: newOverrides.description || p.originalDescription,
            isHidden: newOverrides.isHidden || false,
            titleSource: newOverrides.title ? 'override' : 'evidence',
            descriptionSource: newOverrides.description ? 'override' : 'evidence'
          };
        }
        return p;
      }));
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleReset = async (projectId: string) => {
    setMessage("");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/overrides/project/${encodeURIComponent(projectId)}`, {
        method: "DELETE",
        credentials: "include"
      });
      setMessage("Reset project to evidence.");
      fetchProjects();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const ProjectCard = ({ project }: { project: any }) => {
    // Determine current overrides based on state
    const currentOverrides: any = {};
    if (project.titleSource === 'override') currentOverrides.title = project.title;
    if (project.descriptionSource === 'override') currentOverrides.description = project.description;
    if (project.isHidden) currentOverrides.isHidden = true;

    const [editTitle, setEditTitle] = useState(currentOverrides.title || "");
    const [editDesc, setEditDesc] = useState(currentOverrides.description || "");
    
    // Sync if state changes
    useEffect(() => {
      setEditTitle(currentOverrides.title || "");
      setEditDesc(currentOverrides.description || "");
    }, [project]);

    const isOverridden = Object.keys(currentOverrides).length > 0;

    return (
      <div className={`bg-white dark:bg-slate-950 border ${project.isHidden ? 'border-dashed border-slate-300 dark:border-slate-700 opacity-60' : 'border-slate-200 dark:border-slate-800'} rounded-xl p-6 shadow-sm mb-4 transition-all`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              {project.originalTitle}
              {project.isHidden && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Hidden</span>}
            </h3>
            <p className="text-xs text-slate-500 mt-1 truncate max-w-md">{project.originalDescription || "No description provided"}</p>
          </div>
          <button 
            onClick={() => handleSave(project.id, 'isHidden', !project.isHidden, currentOverrides)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${project.isHidden ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'}`}
          >
            {project.isHidden ? 'Show Project' : 'Hide Project'}
          </button>
        </div>

        {!project.isHidden && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 flex justify-between">
                Title Override
                {project.titleSource === 'override' && <span className="text-indigo-500 text-[10px]">Overridden</span>}
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder={`Override "${project.originalTitle}"`}
                />
                <button 
                  onClick={() => handleSave(project.id, 'title', editTitle, currentOverrides)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 flex justify-between">
                Description Override
                {project.descriptionSource === 'override' && <span className="text-indigo-500 text-[10px]">Overridden</span>}
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Override description..."
                />
                <button 
                  onClick={() => handleSave(project.id, 'description', editDesc, currentOverrides)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>

            {isOverridden && (
              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => handleReset(project.id)}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Reset All Overrides for Project
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="text-slate-500 dark:text-slate-400">Loading projects...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Project Overrides</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage visibility and override titles or descriptions for your extracted projects.</p>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
          message.startsWith("Error") ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400" : "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
        }`}>
          {message}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
          <p className="text-slate-500">No projects found. Please connect GitHub and generate a profile first.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
