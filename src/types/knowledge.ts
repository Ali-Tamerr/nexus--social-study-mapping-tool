export interface Node {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  group: number;
  createdAt: string;
  updatedAt: string;
  x?: number;
  y?: number;
}

export interface Link {
  id: string;
  source: string;
  target: string;
  relationshipType: 'supports' | 'contradicts' | 'neutral';
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

export interface UnlinkedMention {
  sourceNodeId: string;
  sourceNodeTitle: string;
  targetNodeId: string;
  targetNodeTitle: string;
  matchedText: string;
  context: string;
}

export interface PresenceState {
  sessionId: string;
  nodeId: string;
  userId: string;
  lastSeen: string;
}

export type RelationshipType = Link['relationshipType'];

export const RELATIONSHIP_COLORS: Record<RelationshipType, string> = {
  supports: '#10B981',
  contradicts: '#EF4444',
  neutral: '#6B7280',
};

export const GROUP_COLORS: Record<number, string> = {
  0: '#8B5CF6',
  1: '#3B82F6',
  2: '#10B981',
  3: '#F59E0B',
  4: '#EF4444',
  5: '#EC4899',
  6: '#06B6D4',
  7: '#84CC16',
};
