export interface Project {
  id: number;
  name: string;
  description?: string;
  color?: string;
  wallpaper?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  nodes?: Node[];
}

export interface Attachment {
  id: number;
  nodeId: number;
  fileName: string;
  fileUrl: string;
  contentType?: string;
  fileSize?: number;
  userId?: string;
  createdAt: string;
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
  userId?: string;
  createdAt: string;
}

export interface Group {
  id: number;
  name: string;
  color: string;
  order: number;
}

export interface Node {
  id: number;
  projectId?: number;
  title: string;
  content?: string;
  excerpt?: string;
  groupId: number;
  customColor?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  x?: number | null;
  y?: number | null;
  tags?: Tag[];
  attachments?: Attachment[];
  group?: Group;
}

export interface Link {
  id: number;
  sourceId: number;
  targetId: number;
  color: string;
  description?: string;
  userId?: string;
  createdAt: string;
  source?: Node;
  target?: Node;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

export type DrawingTool = 
  | 'pan' 
  | 'select' 
  | 'rectangle' 
  | 'diamond' 
  | 'circle' 
  | 'arrow' 
  | 'line' 
  | 'pen' 
  | 'text' 
  | 'eraser';

export type StrokeStyle = 'solid' | 'dashed' | 'dotted';

export interface DrawnShape {
  id: number;
  projectId: number;
  type: DrawingTool;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  style: StrokeStyle;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  groupId?: number;
  synced?: boolean;
}

export interface GraphSettings {
  isPreviewMode: boolean;
  lockAllMovement: boolean;
  activeTool: DrawingTool;
  strokeWidth: number;
  strokeColor: string;
  strokeStyle: StrokeStyle;
  fontSize: number;
  fontFamily: string;
}

export interface PresenceState {
  sessionId: string;
  nodeId: number;
  userId: string;
  lastSeen: string;
}

export interface Profile {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  email: string;
  displayName?: string;
  avatarUrl?: string;
  password: string;
}

export { GROUP_COLORS, BRAND_COLOR, NODE_COLORS, COLOR_PALETTE } from '@/lib/constants';
