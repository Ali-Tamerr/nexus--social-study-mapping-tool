const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private sessionId: string;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return '';
    let sessionId = sessionStorage.getItem('nexus_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('nexus_session_id', sessionId);
    }
    return sessionId;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': this.sessionId,
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  async getGraphData(): Promise<import('@/types/knowledge').GraphData> {
    return this.request('/graph');
  }

  async getNodes(): Promise<import('@/types/knowledge').Node[]> {
    return this.request('/nodes');
  }

  async getNode(id: string): Promise<import('@/types/knowledge').Node> {
    return this.request(`/nodes/${id}`);
  }

  async createNode(
    node: Omit<import('@/types/knowledge').Node, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<import('@/types/knowledge').Node> {
    return this.request('/nodes', {
      method: 'POST',
      body: JSON.stringify(node),
    });
  }

  async updateNode(
    id: string,
    updates: Partial<import('@/types/knowledge').Node>
  ): Promise<import('@/types/knowledge').Node> {
    return this.request(`/nodes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteNode(id: string): Promise<void> {
    return this.request(`/nodes/${id}`, {
      method: 'DELETE',
    });
  }

  async getLinks(): Promise<import('@/types/knowledge').Link[]> {
    return this.request('/links');
  }

  async createLink(
    link: Omit<import('@/types/knowledge').Link, 'id'>
  ): Promise<import('@/types/knowledge').Link> {
    return this.request('/links', {
      method: 'POST',
      body: JSON.stringify(link),
    });
  }

  async deleteLink(id: string): Promise<void> {
    return this.request(`/links/${id}`, {
      method: 'DELETE',
    });
  }

  async searchNodes(query: string): Promise<import('@/types/knowledge').Node[]> {
    return this.request(`/nodes/search?q=${encodeURIComponent(query)}`);
  }

  async getPresence(): Promise<import('@/types/knowledge').PresenceState[]> {
    return this.request('/presence');
  }

  async updatePresence(nodeId: string | null): Promise<void> {
    return this.request('/presence', {
      method: 'POST',
      body: JSON.stringify({ nodeId }),
    });
  }

  async leavePresence(): Promise<void> {
    return this.request('/presence', {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
