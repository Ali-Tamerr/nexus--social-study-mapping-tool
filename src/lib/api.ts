import type { Project, Node, Link, Tag, Attachment, Profile, RegisterRequest } from '@/types/knowledge';

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7007';
const API_BASE_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;


function pascalToCamel(str: string): string {
  if (!str) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function camelToPascal(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function transformKeys<T>(obj: unknown, transformer: (key: string) => string): T {
  if (obj === null || obj === undefined) return obj as T;
  if (Array.isArray(obj)) {
    return obj.map(item => transformKeys(item, transformer)) as T;
  }
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[transformer(key)] = transformKeys(value, transformer);
    }
    return result as T;
  }
  return obj as T;
}

function toFrontend<T>(data: unknown): T {
  return transformKeys<T>(data, pascalToCamel);
}

function toApi(data: unknown): unknown {
  return transformKeys(data, camelToPascal);
}

async function fetchApi<T>(endpoint: string, options?: RequestInit & { suppressLog?: boolean }): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const { suppressLog, ...fetchOptions } = options || {};

  
  const headers: Record<string, string> = {
    ...fetchOptions.headers as Record<string, string>,
  };

  if (fetchOptions.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const text = await response.text();
      let error;
      try {
        error = JSON.parse(text);
      } catch {
        error = { message: text };
      }
      
      if (!suppressLog) {
        // console.error(`[API] Error ${response.status}:`, error);
        // console.error(`[API] Raw Output:`, text);
      }
      throw new Error(error.title || error.message || `API Error: ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return toFrontend<T>(data);
  } catch (err) {
    if (!suppressLog) {
      // console.error(`[API] Request failed:`, err);
    }
    throw err;
  }
}

async function fetchApiWithBody<T>(endpoint: string, method: string, body: unknown, suppressLog?: boolean): Promise<T> {
  const convertedBody = toApi(body);
  if (!suppressLog) {
    //  console.log(`[API] ${method} ${endpoint} Payload:`, JSON.stringify(convertedBody, null, 2));
  }
  
  return fetchApi<T>(endpoint, {
    method,
    body: JSON.stringify(convertedBody),
    suppressLog,
  });
}

export const api = {
  auth: {
    register: (data: RegisterRequest) =>
      fetchApiWithBody<Profile>('/api/auth/register', 'POST', data),
  },

  projects: {
    getByUser: (userId: string) =>
      fetchApi<Project[]>(`/api/projects?userId=${userId}`),
    
    getById: (id: number) =>
      fetchApi<Project>(`/api/projects/${id}`),
    
    create: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) =>
      fetchApiWithBody<Project>('/api/projects', 'POST', data),
    
    update: (id: number, data: Partial<Project>) =>
      fetchApiWithBody<Project>(`/api/projects/${id}`, 'PUT', data),
    
    delete: (id: number) =>
      fetchApi<void>(`/api/projects/${id}`, { method: 'DELETE' }),
  },

  nodes: {
    getByProject: (projectId: number) =>
      fetchApi<Node[]>(`/api/nodes?projectId=${projectId}`),
    
    getByUser: (userId: string) =>
      fetchApi<Node[]>(`/api/nodes/user/${userId}`),
    
    getById: (id: number) =>
      fetchApi<Node>(`/api/nodes/${id}`),
    
    search: (query: string) =>
      fetchApi<Node[]>(`/api/nodes/search?query=${encodeURIComponent(query)}`),
    
    create: (data: Omit<Node, 'id' | 'createdAt' | 'updatedAt'>) =>
      fetchApiWithBody<Node>('/api/nodes', 'POST', data),
    
    update: (id: number, data: Partial<Node>) =>
      fetchApiWithBody<Node>(`/api/nodes/${id}`, 'PUT', data),
    
    updatePosition: (id: number, x: number, y: number) =>
      fetchApiWithBody<Node>(`/api/nodes/${id}`, 'PUT', { x, y }),
    
    delete: (id: number) =>
      fetchApi<void>(`/api/nodes/${id}`, { method: 'DELETE', suppressLog: true }),
    
    addTag: (nodeId: number, tagId: number) =>
      fetchApi<void>(`/api/nodes/${nodeId}/tags/${tagId}`, { method: 'POST' }),
    
    removeTag: (nodeId: number, tagId: number) =>
      fetchApi<void>(`/api/nodes/${nodeId}/tags/${tagId}`, { method: 'DELETE' }),
  },

  links: {
    getAll: () =>
      fetchApi<Link[]>('/api/links'),
    
    getByNode: (nodeId: number) =>
      fetchApi<Link[]>(`/api/links/node/${nodeId}`),
    
    getByUser: (userId: string) =>
      fetchApi<Link[]>(`/api/links/user/${userId}`),
    
    getById: (id: number) =>
      fetchApi<Link>(`/api/links/${id}`),
    
    create: (data: { sourceId: number; targetId: number; description?: string; userId?: string; color?: string }) =>
      fetchApiWithBody<Link>('/api/links', 'POST', data),
    
    update: (id: number, data: Partial<Link>) =>
      fetchApiWithBody<Link>(`/api/links/${id}`, 'PUT', data),
    
    delete: (id: number) =>
      fetchApi<void>(`/api/links/${id}`, { method: 'DELETE' }),
  },

  tags: {
    getAll: () =>
      fetchApi<Tag[]>('/api/tags'),
    
    getByUser: (userId: string) =>
      fetchApi<Tag[]>(`/api/tags/user/${userId}`),
    
    getById: (id: number) =>
      fetchApi<Tag>(`/api/tags/${id}`),
    
    getByName: (name: string) =>
      fetchApi<Tag>(`/api/tags/name/${encodeURIComponent(name)}`),
    
    create: (data: { name: string; color?: string; userId?: string }) =>
      fetchApiWithBody<Tag>('/api/tags', 'POST', data),
    
    update: (id: number, data: Partial<Tag>) =>
      fetchApiWithBody<Tag>(`/api/tags/${id}`, 'PUT', data),
    
    delete: (id: number) =>
      fetchApi<void>(`/api/tags/${id}`, { method: 'DELETE' }),
  },

  attachments: {
    getByNode: (nodeId: number) =>
      fetchApi<Attachment[]>(`/api/attachments?nodeId=${nodeId}`),
    
    getById: (id: number) =>
      fetchApi<Attachment>(`/api/attachments/${id}`),
    
    create: (data: { nodeId: number; fileName: string; fileUrl: string; userId?: string }) =>
      fetchApiWithBody<Attachment>('/api/attachments', 'POST', data),
    
    delete: (id: number) =>
      fetchApi<void>(`/api/attachments/${id}`, { method: 'DELETE' }),
  },

  groups: {
    getAll: () =>
      fetchApi<{ id: number; name: string; color: string; order: number }[]>('/api/groups'),
    
    getById: (id: number) =>
      fetchApi<{ id: number; name: string; color: string; order: number }>(`/api/groups/${id}`),

    create: (data: { name: string; color: string; order?: number }) =>
      fetchApiWithBody<{ id: number; name: string; color: string; order: number }>('/api/groups', 'POST', data),

    update: (id: number, data: Partial<{ name: string; color: string; order: number }>) =>
      fetchApiWithBody<{ id: number; name: string; color: string; order: number }>(`/api/groups/${id}`, 'PUT', data, true),

    delete: (id: number) =>
      fetchApi<void>(`/api/groups/${id}`, { method: 'DELETE', suppressLog: true }),

    reorder: (sortedIds: number[]) =>
      fetchApiWithBody<void>('/api/groups/reorder', 'PUT', sortedIds, true),
  },

  profiles: {
    getById: (id: string) =>
      fetchApi<Profile>(`/api/profiles/${id}`),
    
    getByEmail: (email: string) =>
      fetchApi<Profile>(`/api/profiles/email/${encodeURIComponent(email)}`),
    
    update: (id: string, data: Partial<Profile>) =>
      fetchApiWithBody<Profile>(`/api/profiles/${id}`, 'PUT', data),
  },

  drawings: {
    getByProject: (projectId: number, groupId?: number) => {
      let url = `/api/drawings?projectId=${projectId}`;
      if (groupId !== undefined) url += `&groupId=${groupId}`;
      return fetchApi<ApiDrawing[]>(url);
    },
    
    getById: (id: number) =>
      fetchApi<ApiDrawing>(`/api/drawings/${id}`),
    
    create: (data: {
      projectId: number;
      type: string;
      points: { x: number; y: number }[];
      color: string;
      width?: number;
      style: string;
      text?: string;
      fontSize?: number;
      fontFamily?: string;
      groupId?: number;
    }) => {
      // Backend expects Points as array of objects
      return fetchApiWithBody<ApiDrawing>('/api/drawings', 'POST', data);
    },
    
    update: (id: number, data: Partial<{
      type: string;
      points: { x: number; y: number }[];
      color: string;
      width: number;
      style: string;
      text: string;
      fontSize: number;
      fontFamily: string;
      groupId: number;
    }>) => {
      return fetchApiWithBody<ApiDrawing>(`/api/drawings/${id}`, 'PUT', data);
    },
    
    delete: (id: number) =>
      fetchApi<void>(`/api/drawings/${id}`, { method: 'DELETE' }),
  },
};

export interface ApiDrawing {
  id: number;
  projectId: number;
  groupId?: number;
  type: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  style: string;
  text: string | null;
  fontSize: number | null;
  fontFamily: string | null;
  createdAt: string;
  updatedAt: string;
}
