'use client';

import { useGraphStore } from '@/store/useGraphStore';
import { Plus, Command, HelpCircle } from 'lucide-react';

export function Header() {
  const toggleCommandPalette = useGraphStore((s) => s.toggleCommandPalette);
  const nodes = useGraphStore((s) => s.nodes);
  const links = useGraphStore((s) => s.links);

  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
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

        <div className="ml-8 flex items-center gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            <span>{nodes.length} nodes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>{links.length} links</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleCommandPalette(true)}
          className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white"
        >
          <Command className="h-4 w-4" />
          <span>Quick Actions</span>
          <kbd className="ml-2 rounded bg-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => toggleCommandPalette(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white transition-all hover:bg-violet-500"
        >
          <Plus className="h-5 w-5" />
        </button>

        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
