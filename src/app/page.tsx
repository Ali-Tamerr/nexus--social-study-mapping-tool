'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Grid3X3, List, ChevronRight, FolderOpen, Loader2 } from 'lucide-react';
import { useGraphStore } from '@/store/useGraphStore';
import { Project } from '@/types/knowledge';
import { api } from '@/lib/api';

export default function HomePage() {
  const router = useRouter();
  const { 
    projects, 
    setProjects, 
    addProject, 
    setCurrentProject, 
    isCreateProjectOpen, 
    toggleCreateProject,
    currentUserId,
    isLoading,
    setLoading
  } = useGraphStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#8B5CF6');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      if (!currentUserId) return;
      
      setLoading(true);
      try {
        const fetchedProjects = await api.projects.getByUser(currentUserId);
        setProjects(fetchedProjects);
      } catch (err) {
        console.error('Failed to load projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [currentUserId, setProjects, setLoading]);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const newProject = await api.projects.create({
        name: newProjectName.trim(),
        description: newProjectDescription.trim() || undefined,
        color: newProjectColor,
        userId: currentUserId || undefined,
      });

      addProject(newProject);
      setNewProjectName('');
      setNewProjectDescription('');
      setNewProjectColor('#8B5CF6');
      toggleCreateProject(false);
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProject = (project: Project) => {
    setCurrentProject(project);
    router.push(`/project/${project.id}`);
  };

  const projectColors = [
    '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', 
    '#EF4444', '#EC4899', '#06B6D4', '#84CC16'
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 opacity-75 blur" />
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
              <span className="text-lg font-bold text-white">N</span>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Nexus</h1>
            <p className="text-[10px] text-zinc-500">Knowledge Graph Explorer</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="ml-2 rounded bg-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400">⌘K</kbd>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Projects</h2>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a project"
              className="w-full rounded-lg bg-zinc-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none ring-1 ring-zinc-700 transition-all focus:ring-violet-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-lg bg-zinc-800/50 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-md p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-md p-1.5 transition-colors ${viewMode === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => toggleCreateProject(true)}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              <Plus className="h-4 w-4" />
              New project
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            <p className="mt-4 text-sm text-zinc-400">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FolderOpen className="h-16 w-16 text-zinc-700" />
            <p className="mt-4 text-lg text-zinc-400">No projects found</p>
            <p className="text-sm text-zinc-500">Create your first project to get started</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-3'}>
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleOpenProject(project)}
                className={`group relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900 ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}
              >
                <div className={viewMode === 'list' ? 'flex items-center gap-4' : ''}>
                  <div className="flex items-start gap-3">
                    {project.color && (
                      <div 
                        className="mt-1 h-3 w-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={`flex items-center gap-3 text-xs text-zinc-500 ${viewMode === 'grid' ? 'mt-4' : ''}`}>
                    <span className="text-zinc-600">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-zinc-400" />
              </button>
            ))}
          </div>
        )}
      </main>

      {isCreateProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => toggleCreateProject(false)} />
          <div className="relative w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Create new project</h3>
            <p className="mt-1 text-sm text-zinc-400">Start building your knowledge graph</p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300">Project name</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="My Knowledge Graph"
                  className="mt-2 w-full rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none ring-1 ring-zinc-700 transition-all focus:ring-violet-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300">Description (optional)</label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="A brief description of your project..."
                  rows={3}
                  className="mt-2 w-full resize-none rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none ring-1 ring-zinc-700 transition-all focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300">Color</label>
                <div className="mt-2 flex gap-2">
                  {projectColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewProjectColor(color)}
                      className={`h-8 w-8 rounded-lg transition-all ${
                        newProjectColor === color
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => toggleCreateProject(false)}
                className="rounded-lg px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim() || isLoading}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
