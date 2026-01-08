'use client';

import { useMemo, useEffect, useRef } from 'react';
import { useGraphStore } from '@/store/useGraphStore';
import type { Node } from '@/types/knowledge';
import { Link2 } from 'lucide-react';

interface LinkSearchDropdownProps {
  query: string;
  position: { x: number; y: number };
  onSelect: (node: Node) => void;
  onClose: () => void;
}

export function LinkSearchDropdown({
  query,
  position,
  onSelect,
  onClose,
}: LinkSearchDropdownProps) {
  const nodes = useGraphStore((s) => s.nodes);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredNodes = useMemo(() => {
    if (!query) return nodes.slice(0, 10);
    const lowerQuery = query.toLowerCase();
    return nodes
      .filter((n) => n.title.toLowerCase().includes(lowerQuery))
      .slice(0, 10);
  }, [nodes, query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as HTMLElement)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (filteredNodes.length === 0) {
    return (
      <div
        ref={dropdownRef}
        className="fixed z-50 w-64 rounded-lg border border-zinc-700 bg-zinc-800 p-3 shadow-xl"
        style={{ left: position.x, top: position.y }}
      >
        <p className="text-sm text-zinc-400">No nodes found</p>
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="fixed z-50 max-h-64 w-72 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-800 py-1 shadow-xl"
      style={{ left: position.x, top: position.y }}
    >
      <div className="px-3 py-2 text-xs font-medium text-zinc-500 uppercase">
        Link to node
      </div>
      {filteredNodes.map((node) => (
        <button
          key={node.id}
          onClick={() => onSelect(node)}
          className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-zinc-700"
        >
          <Link2 className="h-4 w-4 text-violet-400" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{node.title}</p>
            {node.excerpt && (
              <p className="truncate text-xs text-zinc-500">{node.excerpt}</p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
