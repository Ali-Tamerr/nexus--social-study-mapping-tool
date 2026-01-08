'use client';

import { useEffect } from 'react';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { Sidebar } from '@/components/ui/Sidebar';
import { Header } from '@/components/ui/Header';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { useGraphStore } from '@/store/useGraphStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import type { Node, Link } from '@/types/knowledge';

const DEMO_NODES: Node[] = [
  {
    id: '1',
    title: 'What is a Knowledge Graph?',
    content: 'A knowledge graph is a structured representation of facts, consisting of **entities** (nodes) and **relationships** (edges) between them.\n\nKey concepts:\n- Nodes represent ideas or concepts\n- Edges represent relationships\n- Enables non-linear thinking\n\nRelated to [[Zettelkasten Method]] and [[Second Brain]].',
    excerpt: 'A knowledge graph is a structured representation of facts...',
    tags: ['concept', 'foundation'],
    group: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Zettelkasten Method',
    content: 'The Zettelkasten method is a personal knowledge management system popularized by German sociologist **Niklas Luhmann**.\n\nCore principles:\n- Each note should contain one idea\n- Notes should be linked to other notes\n- Use unique identifiers\n\nSee also [[What is a Knowledge Graph?]] and [[Atomic Notes]].',
    excerpt: 'The Zettelkasten method is a personal knowledge management system...',
    tags: ['method', 'productivity'],
    group: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Second Brain',
    content: 'Building a "Second Brain" is a methodology for saving and systematically reminding us of the ideas, inspirations, insights, and connections.\n\nKey framework: **CODE**\n- Capture\n- Organize\n- Distill\n- Express\n\nConnects with [[What is a Knowledge Graph?]] and [[Personal Knowledge Management]].',
    excerpt: 'Building a Second Brain is a methodology for saving and systematically...',
    tags: ['productivity', 'system'],
    group: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Atomic Notes',
    content: 'Atomic notes are self-contained ideas that can stand on their own.\n\nProperties of atomic notes:\n- **Single focus**: One idea per note\n- **Context-independent**: Understandable without other notes\n- **Linkable**: Easy to connect to other atoms\n\nFundamental to [[Zettelkasten Method]].',
    excerpt: 'Atomic notes are self-contained ideas that can stand on their own...',
    tags: ['concept', 'writing'],
    group: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Personal Knowledge Management',
    content: 'PKM is a process of collecting information that a person uses to gather, classify, store, search, retrieve and share knowledge.\n\nTools for PKM:\n- Note-taking apps (Obsidian, Roam)\n- Knowledge graphs\n- Spaced repetition systems\n\nRelated: [[Second Brain]] and [[Zettelkasten Method]].',
    excerpt: 'PKM is a process of collecting information that a person uses...',
    tags: ['system', 'productivity'],
    group: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Bidirectional Linking',
    content: 'Bidirectional links are connections that work both ways. When you link note A to note B, note B automatically links back to note A.\n\nBenefits:\n- Discover unexpected connections\n- Build associative thinking\n- Reduce friction in note-taking\n\nCore feature of modern PKM tools.',
    excerpt: 'Bidirectional links are connections that work both ways...',
    tags: ['concept', 'feature'],
    group: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Graph Visualization',
    content: 'Visualizing knowledge as a graph helps reveal patterns and connections that aren\'t obvious in linear formats.\n\nGraph layouts:\n- Force-directed (organic)\n- Hierarchical (structured)\n- Radial (centered)\n\nUsed extensively in [[What is a Knowledge Graph?]].',
    excerpt: 'Visualizing knowledge as a graph helps reveal patterns...',
    tags: ['visualization', 'feature'],
    group: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Emergence in Networks',
    content: 'When enough nodes connect, emergent properties appear - insights that weren\'t planned but arise from the structure itself.\n\nExamples:\n- Cluster discovery\n- Bridge concepts\n- Knowledge gaps\n\nThis is the true power of [[What is a Knowledge Graph?]].',
    excerpt: 'When enough nodes connect, emergent properties appear...',
    tags: ['concept', 'insight'],
    group: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEMO_LINKS: Link[] = [
  { id: 'l1', source: '1', target: '2', relationshipType: 'supports' },
  { id: 'l2', source: '1', target: '3', relationshipType: 'supports' },
  { id: 'l3', source: '2', target: '4', relationshipType: 'supports' },
  { id: 'l4', source: '2', target: '5', relationshipType: 'neutral' },
  { id: 'l5', source: '3', target: '5', relationshipType: 'supports' },
  { id: 'l6', source: '4', target: '2', relationshipType: 'supports' },
  { id: 'l7', source: '5', target: '3', relationshipType: 'supports' },
  { id: 'l8', source: '6', target: '1', relationshipType: 'supports' },
  { id: 'l9', source: '6', target: '2', relationshipType: 'neutral' },
  { id: 'l10', source: '7', target: '1', relationshipType: 'supports' },
  { id: 'l11', source: '8', target: '1', relationshipType: 'supports' },
  { id: 'l12', source: '8', target: '7', relationshipType: 'neutral' },
];

export default function Home() {
  const setGraphData = useGraphStore((s) => s.setGraphData);
  const activeNode = useGraphStore((s) => s.activeNode);
  const isEditorOpen = useGraphStore((s) => s.isEditorOpen);

  useKeyboardShortcuts();

  useEffect(() => {
    setGraphData({ nodes: DEMO_NODES, links: DEMO_LINKS });
  }, [setGraphData]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-950">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="relative flex-1 overflow-hidden">
          <div className="graph-container graph-canvas h-full w-full">
            <GraphCanvas />
          </div>

          {isEditorOpen && activeNode && (
            <div className="absolute right-0 top-0 z-20 h-full w-[440px] shadow-2xl">
              <EditorPanel node={activeNode} />
            </div>
          )}
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}
