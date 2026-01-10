import type { Project, Node, Link, Tag, Attachment, Profile, RegisterRequest } from '@/types/knowledge';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7007';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.title || `API Error: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: RegisterRequest) =>
      fetchApi<Profile>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  projects: {
    getByUser: (userId: string) =>
      fetchApi<Project[]>(`/api/projects?userId=${userId}`),
    
    getById: (id: string) =>
      fetchApi<Project>(`/api/projects/${id}`),
    
    create: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) =>
      fetchApi<Project>('/api/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: Partial<Project>) =>
      fetchApi<Project>(`/api/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      fetchApi<void>(`/api/projects/${id}`, { method: 'DELETE' }),
  },

  nodes: {
    getByProject: (projectId: string) =>
      fetchApi<Node[]>(`/api/nodes?projectId=${projectId}`),
    
    getByUser: (userId: string) =>
      fetchApi<Node[]>(`/api/nodes/user/${userId}`),
    
    getById: (id: string) =>
      fetchApi<Node>(`/api/nodes/${id}`),
    
    search: (query: string) =>
      fetchApi<Node[]>(`/api/nodes/search?query=${encodeURIComponent(query)}`),
    
    create: (data: Omit<Node, 'id' | 'createdAt' | 'updatedAt'>) =>
      fetchApi<Node>('/api/nodes', {
        method: 'POST',
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          groupId: data.groupId,
          projectId: data.projectId,
          userId: data.userId,
        }),
      }),
    
    update: (id: string, data: Partial<Node>) =>
      fetchApi<Node>(`/api/nodes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      fetchApi<void>(`/api/nodes/${id}`, { method: 'DELETE' }),
    
    addTag: (nodeId: string, tagId: string) =>
      fetchApi<void>(`/api/nodes/${nodeId}/tags/${tagId}`, { method: 'POST' }),
    
    removeTag: (nodeId: string, tagId: string) =>
      fetchApi<void>(`/api/nodes/${nodeId}/tags/${tagId}`, { method: 'DELETE' }),
  },

  links: {
    getAll: () =>
      fetchApi<Link[]>('/api/links'),
    
    getByNode: (nodeId: string) =>
      fetchApi<Link[]>(`/api/links/node/${nodeId}`),
    
    getByUser: (userId: string) =>
      fetchApi<Link[]>(`/api/links/user/${userId}`),
    
    getById: (id: string) =>
      fetchApi<Link>(`/api/links/${id}`),
    
    create: (data: { sourceId: string; targetId: string; relationshipType?: string; userId?: string }) =>
      fetchApi<Link>('/api/links', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: Partial<Link>) =>
      fetchApi<Link>(`/api/links/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      fetchApi<void>(`/api/links/${id}`, { method: 'DELETE' }),
  },

  tags: {
    getAll: () =>
      fetchApi<Tag[]>('/api/tags'),
    
    getByUser: (userId: string) =>
      fetchApi<Tag[]>(`/api/tags/user/${userId}`),
    
    getById: (id: string) =>
      fetchApi<Tag>(`/api/tags/${id}`),
    
    getByName: (name: string) =>
      fetchApi<Tag>(`/api/tags/name/${encodeURIComponent(name)}`),
    
    create: (data: { name: string; color?: string; userId?: string }) =>
      fetchApi<Tag>('/api/tags', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: Partial<Tag>) =>
      fetchApi<Tag>(`/api/tags/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      fetchApi<void>(`/api/tags/${id}`, { method: 'DELETE' }),
  },

  attachments: {
    getByNode: (nodeId: string) =>
      fetchApi<Attachment[]>(`/api/attachments?nodeId=${nodeId}`),
    
    getById: (id: string) =>
      fetchApi<Attachment>(`/api/attachments/${id}`),
    
    create: (data: { nodeId: string; fileName: string; fileUrl: string; contentType: string; fileSize: number; userId?: string }) =>
      fetchApi<Attachment>('/api/attachments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      fetchApi<void>(`/api/attachments/${id}`, { method: 'DELETE' }),
  },

  groups: {
    getAll: () =>
      fetchApi<{ id: number; name: string; color: string }[]>('/api/groups'),
    
    getById: (id: number) =>
      fetchApi<{ id: number; name: string; color: string }>(`/api/groups/${id}`),
  },

  profiles: {
    getById: (id: string) =>
      fetchApi<Profile>(`/api/profiles/${id}`),
    
    getByEmail: (email: string) =>
      fetchApi<Profile>(`/api/profiles/email/${encodeURIComponent(email)}`),
    
    update: (id: string, data: Partial<Profile>) =>
      fetchApi<Profile>(`/api/profiles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
};
