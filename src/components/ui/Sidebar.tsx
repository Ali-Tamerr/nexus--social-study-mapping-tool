'use client';

import { useState, useMemo } from 'react';
import { useGraphStore, filterNodes, extractAllTags } from '@/store/useGraphStore';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Tag,
  Network,
  Lightbulb,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GROUP_COLORS } from '@/types/knowledge';
import { UnlinkedMentionsPanel } from './UnlinkedMentionsPanel';

export function Sidebar() {
  const [isTagsExpanded, setIsTagsExpanded] = useState(true);
  const [isNodesExpanded, setIsNodesExpanded] = useState(true);
  const [showUnlinkedMentions, setShowUnlinkedMentions] = useState(false);

  const nodes = useGraphStore((s) => s.nodes);
  const searchQuery = useGraphStore((s) => s.searchQuery);
  const setSearchQuery = useGraphStore((s) => s.setSearchQuery);
  const selectedTags = useGraphStore((s) => s.selectedTags);
  const toggleTag = useGraphStore((s) => s.toggleTag);
  const setActiveNode = useGraphStore((s) => s.setActiveNode);
  const activeNode = useGraphStore((s) => s.activeNode);
  const findUnlinkedMentions = useGraphStore((s) => s.findUnlinkedMentions);
  const unlinkedMentions = useGraphStore((s) => s.unlinkedMentions);

  const allTags = useMemo(() => extractAllTags(nodes), [nodes]);
  const filteredNodes = useMemo(
    () => filterNodes(nodes, searchQuery, selectedTags),
    [nodes, searchQuery, selectedTags]
  );

  const handleFindUnlinked = () => {
    findUnlinkedMentions();
    setShowUnlinkedMentions(true);
  };

  return (
    <aside className="flex h-full w-72 flex-col border-r border-zinc-800 bg-zinc-900/50">
      <div className="border-b border-zinc-800 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes..."
            className="w-full rounded-lg bg-zinc-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:bg-zinc-800 focus:ring-1 focus:ring-violet-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-zinc-800">
          <button
            onClick={() => setIsTagsExpanded(!isTagsExpanded)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800/50"
          >
            <span className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-amber-400" />
              Tags
            </span>
            {isTagsExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isTagsExpanded && (
            <div className="flex flex-wrap gap-2 px-4 pb-4">
              {allTags.length === 0 ? (
                <p className="text-xs text-zinc-500">No tags yet</p>
              ) : (
                allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-medium transition-all',
                      selectedTags.includes(tag)
                        ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                    )}
                  >
                    #{tag}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="border-b border-zinc-800">
          <button
            onClick={() => setIsNodesExpanded(!isNodesExpanded)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800/50"
          >
            <span className="flex items-center gap-2">
              <Network className="h-4 w-4 text-violet-400" />
              Nodes ({filteredNodes.length})
            </span>
            {isNodesExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isNodesExpanded && (
            <div className="max-h-64 overflow-y-auto pb-2">
              {filteredNodes.length === 0 ? (
                <p className="px-4 py-2 text-xs text-zinc-500">No nodes found</p>
              ) : (
                filteredNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setActiveNode(node)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2 text-left transition-colors',
                      activeNode?.id === node.id
                        ? 'bg-violet-500/20 text-white'
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                    )}
                  >
                    <span
                      className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: GROUP_COLORS[node.group] }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{node.title}</p>
                      {node.excerpt && (
                        <p className="truncate text-xs text-zinc-500">{node.excerpt}</p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="p-4">
          <button
            onClick={handleFindUnlinked}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-800/30 py-3 text-sm text-zinc-400 transition-all hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-400"
          >
            <Lightbulb className="h-4 w-4" />
            Find Unlinked Mentions
            {unlinkedMentions.length > 0 && (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                {unlinkedMentions.length}
              </span>
            )}
          </button>
        </div>

        {showUnlinkedMentions && unlinkedMentions.length > 0 && (
          <UnlinkedMentionsPanel onClose={() => setShowUnlinkedMentions(false)} />
        )}
      </div>

      <div className="border-t border-zinc-800 p-4">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>Nexus Knowledge Graph</span>
          <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </div>
      </div>
    </aside>
  );
}
