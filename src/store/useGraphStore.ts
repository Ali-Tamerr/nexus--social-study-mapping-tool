import { create } from 'zustand';
import type { Node, Link, GraphData, UnlinkedMention } from '@/types/knowledge';

interface GraphState {
  nodes: Node[];
  links: Link[];
  activeNode: Node | null;
  hoveredNode: Node | null;
  searchQuery: string;
  isEditorOpen: boolean;
  isCommandPaletteOpen: boolean;
  selectedTags: string[];
  unlinkedMentions: UnlinkedMention[];
  isLoading: boolean;
  
  setNodes: (nodes: Node[]) => void;
  setLinks: (links: Link[]) => void;
  setGraphData: (data: GraphData) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  deleteNode: (id: string) => void;
  addLink: (link: Link) => void;
  deleteLink: (id: string) => void;
  setActiveNode: (node: Node | null) => void;
  setHoveredNode: (node: Node | null) => void;
  setSearchQuery: (query: string) => void;
  toggleEditor: (open?: boolean) => void;
  toggleCommandPalette: (open?: boolean) => void;
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  setUnlinkedMentions: (mentions: UnlinkedMention[]) => void;
  setLoading: (loading: boolean) => void;
  findUnlinkedMentions: () => void;
}

export const useGraphStore = create<GraphState>()((set, get) => ({
  nodes: [],
  links: [],
  activeNode: null,
  hoveredNode: null,
  searchQuery: '',
  isEditorOpen: false,
  isCommandPaletteOpen: false,
  selectedTags: [],
  unlinkedMentions: [],
  isLoading: false,

  setNodes: (nodes) => set({ nodes }),
  setLinks: (links) => set({ links }),
  setGraphData: (data) => set({ nodes: data.nodes, links: data.links }),
  
  addNode: (node) => set((state) => ({ 
    nodes: [...state.nodes, node] 
  })),
  
  updateNode: (id, updates) => set((state) => ({
    nodes: state.nodes.map((n) => 
      n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
    ),
    activeNode: state.activeNode?.id === id 
      ? { ...state.activeNode, ...updates, updatedAt: new Date().toISOString() } 
      : state.activeNode
  })),
  
  deleteNode: (id) => set((state) => ({
    nodes: state.nodes.filter((n) => n.id !== id),
    links: state.links.filter((l) => l.source !== id && l.target !== id),
    activeNode: state.activeNode?.id === id ? null : state.activeNode
  })),
  
  addLink: (link) => set((state) => ({ 
    links: [...state.links, link] 
  })),
  
  deleteLink: (id) => set((state) => ({
    links: state.links.filter((l) => l.id !== id)
  })),
  
  setActiveNode: (node) => set({ activeNode: node, isEditorOpen: node !== null }),
  setHoveredNode: (node) => set({ hoveredNode: node }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleEditor: (open) => set((state) => ({ 
    isEditorOpen: open ?? !state.isEditorOpen 
  })),
  toggleCommandPalette: (open) => set((state) => ({ 
    isCommandPaletteOpen: open ?? !state.isCommandPaletteOpen 
  })),
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  toggleTag: (tag) => set((state) => ({
    selectedTags: state.selectedTags.includes(tag)
      ? state.selectedTags.filter((t) => t !== tag)
      : [...state.selectedTags, tag]
  })),
  setUnlinkedMentions: (mentions) => set({ unlinkedMentions: mentions }),
  setLoading: (loading) => set({ isLoading: loading }),
  
  findUnlinkedMentions: () => {
    const { nodes, links } = get();
    const mentions: UnlinkedMention[] = [];
    
    const existingLinks = new Set(
      links.map((l) => `${l.source}-${l.target}`)
    );
    
    nodes.forEach((sourceNode) => {
      nodes.forEach((targetNode) => {
        if (sourceNode.id === targetNode.id) return;
        
        const linkKey1 = `${sourceNode.id}-${targetNode.id}`;
        const linkKey2 = `${targetNode.id}-${sourceNode.id}`;
        if (existingLinks.has(linkKey1) || existingLinks.has(linkKey2)) return;
        
        const titleLower = targetNode.title.toLowerCase();
        const contentLower = sourceNode.content.toLowerCase();
        
        const index = contentLower.indexOf(titleLower);
        if (index !== -1 && titleLower.length >= 3) {
          const start = Math.max(0, index - 30);
          const end = Math.min(sourceNode.content.length, index + titleLower.length + 30);
          const context = sourceNode.content.substring(start, end);
          
          mentions.push({
            sourceNodeId: sourceNode.id,
            sourceNodeTitle: sourceNode.title,
            targetNodeId: targetNode.id,
            targetNodeTitle: targetNode.title,
            matchedText: targetNode.title,
            context: (start > 0 ? '...' : '') + context + (end < sourceNode.content.length ? '...' : '')
          });
        }
      });
    });
    
    set({ unlinkedMentions: mentions });
  }
}));

export function filterNodes(
  nodes: Node[],
  searchQuery: string,
  selectedTags: string[]
): Node[] {
  let filtered = nodes;
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query) ||
        n.tags.some((t) => t.toLowerCase().includes(query))
    );
  }
  
  if (selectedTags.length > 0) {
    filtered = filtered.filter((n) =>
      selectedTags.some((tag) => n.tags.includes(tag))
    );
  }
  
  return filtered;
}

export function extractAllTags(nodes: Node[]): string[] {
  const tagsSet = new Set<string>();
  nodes.forEach((n) => n.tags.forEach((t) => tagsSet.add(t)));
  return Array.from(tagsSet).sort();
}
