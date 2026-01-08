'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useGraphStore, extractAllTags } from '@/store/useGraphStore';
import { useCreateNode } from '@/hooks/useKnowledgeApi';
import { Search, Plus, FileText, Tag, Link2, Command, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Node } from '@/types/knowledge';

type ActionType = 'create' | 'search' | 'navigate' | 'filter';

interface CommandAction {
  id: string;
  type: ActionType;
  label: string;
  description?: string;
  icon: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

export function CommandPalette() {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<'search' | 'create'>('search');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isOpen = useGraphStore((s) => s.isCommandPaletteOpen);
  const toggleCommandPalette = useGraphStore((s) => s.toggleCommandPalette);
  const nodes = useGraphStore((s) => s.nodes);
  const setActiveNode = useGraphStore((s) => s.setActiveNode);
  const setSearchQuery = useGraphStore((s) => s.setSearchQuery);
  const toggleTag = useGraphStore((s) => s.toggleTag);

  const allTags = useMemo(() => extractAllTags(nodes), [nodes]);

  const createNode = useCreateNode();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
      setMode('search');
    }
  }, [isOpen]);

  const filteredNodes = useMemo(() => {
    if (!query) return nodes.slice(0, 5);
    const lowerQuery = query.toLowerCase();
    return nodes
      .filter(
        (n) =>
          n.title.toLowerCase().includes(lowerQuery) ||
          n.content.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 8);
  }, [nodes, query]);

  const filteredTags = useMemo(() => {
    if (!query) return allTags.slice(0, 3);
    const lowerQuery = query.toLowerCase();
    return allTags.filter((t) => t.toLowerCase().includes(lowerQuery)).slice(0, 5);
  }, [allTags, query]);

  const actions = useMemo<CommandAction[]>(() => {
    const items: CommandAction[] = [];

    if (mode === 'search') {
      if (query) {
        items.push({
          id: 'create-new',
          type: 'create',
          label: `Create "${query}"`,
          description: 'Create a new node with this title',
          icon: <Plus className="h-4 w-4 text-emerald-400" />,
          shortcut: '⏎',
          onSelect: () => handleCreateNode(query),
        });
      }

      filteredNodes.forEach((node) => {
        items.push({
          id: `node-${node.id}`,
          type: 'navigate',
          label: node.title,
          description: node.excerpt,
          icon: <FileText className="h-4 w-4 text-violet-400" />,
          onSelect: () => handleSelectNode(node),
        });
      });

      if (filteredTags.length > 0) {
        filteredTags.forEach((tag) => {
          items.push({
            id: `tag-${tag}`,
            type: 'filter',
            label: `Filter by #${tag}`,
            icon: <Tag className="h-4 w-4 text-amber-400" />,
            onSelect: () => handleFilterByTag(tag),
          });
        });
      }

      items.push({
        id: 'search-graph',
        type: 'search',
        label: query ? `Search graph for "${query}"` : 'Search entire graph',
        icon: <Search className="h-4 w-4 text-blue-400" />,
        onSelect: () => handleSearchGraph(),
      });
    }

    return items;
  }, [mode, query, filteredNodes, filteredTags]);

  const handleCreateNode = useCallback(
    (title: string) => {
      createNode.mutate(
        {
          title,
          content: '',
          excerpt: '',
          tags: [],
          group: Math.floor(Math.random() * 8),
        },
        {
          onSuccess: (newNode) => {
            setActiveNode(newNode);
            toggleCommandPalette(false);
          },
        }
      );
    },
    [createNode, setActiveNode, toggleCommandPalette]
  );

  const handleSelectNode = useCallback(
    (node: Node) => {
      setActiveNode(node);
      toggleCommandPalette(false);
    },
    [setActiveNode, toggleCommandPalette]
  );

  const handleFilterByTag = useCallback(
    (tag: string) => {
      toggleTag(tag);
      toggleCommandPalette(false);
    },
    [toggleTag, toggleCommandPalette]
  );

  const handleSearchGraph = useCallback(() => {
    setSearchQuery(query);
    toggleCommandPalette(false);
  }, [query, setSearchQuery, toggleCommandPalette]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, actions.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          actions[selectedIndex]?.onSelect();
          break;
        case 'Escape':
          e.preventDefault();
          toggleCommandPalette(false);
          break;
      }
    },
    [actions, selectedIndex, toggleCommandPalette]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => toggleCommandPalette(false)}
      />
      <div className="relative w-full max-w-xl">
        <div className="overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-zinc-800 px-4">
            <Command className="h-5 w-5 text-zinc-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search nodes, create new, or filter by tag..."
              className="flex-1 bg-transparent py-4 text-lg text-white placeholder-zinc-500 outline-none"
            />
            <kbd className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400">ESC</kbd>
          </div>

          <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
            {actions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-zinc-500">
                <Search className="mb-2 h-8 w-8" />
                <p className="text-sm">No results found</p>
              </div>
            ) : (
              actions.map((action, index) => (
                <button
                  key={action.id}
                  onClick={action.onSelect}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all',
                    index === selectedIndex
                      ? 'bg-violet-500/20 text-white'
                      : 'text-zinc-300 hover:bg-zinc-800'
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 group-hover:bg-zinc-700">
                    {action.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{action.label}</p>
                    {action.description && (
                      <p className="truncate text-xs text-zinc-500">{action.description}</p>
                    )}
                  </div>
                  {action.shortcut && (
                    <kbd className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400">
                      {action.shortcut}
                    </kbd>
                  )}
                  <ArrowRight className="h-4 w-4 text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))
            )}
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-2 text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-zinc-800 px-1.5 py-0.5">↑</kbd>
                <kbd className="rounded bg-zinc-800 px-1.5 py-0.5">↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-zinc-800 px-1.5 py-0.5">⏎</kbd>
                select
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link2 className="h-3 w-3" />
              <span>{nodes.length} nodes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
