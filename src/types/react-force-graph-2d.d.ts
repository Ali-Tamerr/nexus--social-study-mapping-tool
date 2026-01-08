declare module 'react-force-graph-2d' {
  import { Component } from 'react';

  export interface NodeObject {
    id?: string | number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number;
    fy?: number;
    [key: string]: unknown;
  }

  export interface LinkObject {
    source?: string | number | NodeObject;
    target?: string | number | NodeObject;
    [key: string]: unknown;
  }

  export interface GraphData {
    nodes: NodeObject[];
    links: LinkObject[];
  }

  export interface ForceGraphMethods<NodeType = NodeObject, LinkType = LinkObject> {
    centerAt: (x?: number, y?: number, ms?: number) => void;
    zoom: (scale?: number, ms?: number) => void;
    zoomToFit: (ms?: number, padding?: number, nodeFilterFn?: (node: NodeType) => boolean) => void;
    pauseAnimation: () => void;
    resumeAnimation: () => void;
    d3Force: (forceName: string, force?: unknown) => unknown;
    d3ReheatSimulation: () => void;
    emitParticle: (link: LinkType) => void;
    refresh: () => void;
    getGraphBbox: (nodeFilterFn?: (node: NodeType) => boolean) => { x: [number, number]; y: [number, number] };
    screen2GraphCoords: (x: number, y: number) => { x: number; y: number };
    graph2ScreenCoords: (x: number, y: number) => { x: number; y: number };
  }

  export interface ForceGraphProps<NodeType = NodeObject, LinkType = LinkObject> {
    graphData?: GraphData;
    nodeId?: string;
    linkSource?: string;
    linkTarget?: string;
    width?: number;
    height?: number;
    backgroundColor?: string;
    nodeRelSize?: number;
    nodeVal?: number | ((node: NodeType) => number);
    nodeLabel?: string | ((node: NodeType) => string);
    nodeVisibility?: boolean | ((node: NodeType) => boolean);
    nodeColor?: string | ((node: NodeType) => string);
    nodeAutoColorBy?: string | ((node: NodeType) => string | null);
    nodeCanvasObject?: (node: NodeType, ctx: CanvasRenderingContext2D, globalScale: number) => void;
    nodeCanvasObjectMode?: string | ((node: NodeType) => string);
    nodePointerAreaPaint?: (node: NodeType, color: string, ctx: CanvasRenderingContext2D) => void;
    linkLabel?: string | ((link: LinkType) => string);
    linkVisibility?: boolean | ((link: LinkType) => boolean);
    linkColor?: string | ((link: LinkType) => string);
    linkAutoColorBy?: string | ((link: LinkType) => string | null);
    linkWidth?: number | ((link: LinkType) => number);
    linkCurvature?: number | ((link: LinkType) => number);
    linkCanvasObject?: (link: LinkType, ctx: CanvasRenderingContext2D, globalScale: number) => void;
    linkCanvasObjectMode?: string | ((link: LinkType) => string);
    linkDirectionalArrowLength?: number | ((link: LinkType) => number);
    linkDirectionalArrowColor?: string | ((link: LinkType) => string);
    linkDirectionalArrowRelPos?: number | ((link: LinkType) => number);
    linkDirectionalParticles?: number | ((link: LinkType) => number);
    linkDirectionalParticleSpeed?: number | ((link: LinkType) => number);
    linkDirectionalParticleWidth?: number | ((link: LinkType) => number);
    linkDirectionalParticleColor?: string | ((link: LinkType) => string);
    linkPointerAreaPaint?: (link: LinkType, color: string, ctx: CanvasRenderingContext2D) => void;
    dagMode?: 'td' | 'bu' | 'lr' | 'rl' | 'radialout' | 'radialin';
    dagLevelDistance?: number;
    d3AlphaMin?: number;
    d3AlphaDecay?: number;
    d3VelocityDecay?: number;
    warmupTicks?: number;
    cooldownTicks?: number;
    cooldownTime?: number;
    onEngineTick?: () => void;
    onEngineStop?: () => void;
    onNodeClick?: (node: NodeType, event: MouseEvent) => void;
    onNodeRightClick?: (node: NodeType, event: MouseEvent) => void;
    onNodeHover?: (node: NodeType | null, previousNode: NodeType | null) => void;
    onNodeDrag?: (node: NodeType, translate: { x: number; y: number }) => void;
    onNodeDragEnd?: (node: NodeType, translate: { x: number; y: number }) => void;
    onLinkClick?: (link: LinkType, event: MouseEvent) => void;
    onLinkRightClick?: (link: LinkType, event: MouseEvent) => void;
    onLinkHover?: (link: LinkType | null, previousLink: LinkType | null) => void;
    onBackgroundClick?: (event: MouseEvent) => void;
    onBackgroundRightClick?: (event: MouseEvent) => void;
    onZoom?: (transform: { k: number; x: number; y: number }) => void;
    onZoomEnd?: (transform: { k: number; x: number; y: number }) => void;
    enableNodeDrag?: boolean;
    enableZoomInteraction?: boolean;
    enablePanInteraction?: boolean;
    enablePointerInteraction?: boolean;
    autoPauseRedraw?: boolean;
    minZoom?: number;
    maxZoom?: number;
  }

  export default class ForceGraph2D<
    NodeType extends NodeObject = NodeObject,
    LinkType extends LinkObject = LinkObject
  > extends Component<ForceGraphProps<NodeType, LinkType>> {}
}
