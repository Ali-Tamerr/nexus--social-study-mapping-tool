'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { Node, Link, GraphData } from '@/types/knowledge';
import { useGraphStore } from '@/store/useGraphStore';

export const graphKeys = {
  all: ['graph'] as const,
  data: () => [...graphKeys.all, 'data'] as const,
  nodes: () => [...graphKeys.all, 'nodes'] as const,
  node: (id: string) => [...graphKeys.nodes(), id] as const,
  links: () => [...graphKeys.all, 'links'] as const,
  search: (query: string) => [...graphKeys.nodes(), 'search', query] as const,
  presence: () => [...graphKeys.all, 'presence'] as const,
};

export function useGraphData() {
  const setGraphData = useGraphStore((s) => s.setGraphData);
  const setLoading = useGraphStore((s) => s.setLoading);

  return useQuery({
    queryKey: graphKeys.data(),
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await apiClient.getGraphData();
        setGraphData(data);
        return data;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useNodes() {
  return useQuery({
    queryKey: graphKeys.nodes(),
    queryFn: () => apiClient.getNodes(),
  });
}

export function useNode(id: string) {
  return useQuery({
    queryKey: graphKeys.node(id),
    queryFn: () => apiClient.getNode(id),
    enabled: !!id,
  });
}

export function useCreateNode() {
  const queryClient = useQueryClient();
  const addNode = useGraphStore((s) => s.addNode);

  return useMutation({
    mutationFn: (node: Omit<Node, 'id' | 'createdAt' | 'updatedAt'>) =>
      apiClient.createNode(node),
    onSuccess: (newNode) => {
      addNode(newNode);
      queryClient.invalidateQueries({ queryKey: graphKeys.nodes() });
      queryClient.invalidateQueries({ queryKey: graphKeys.data() });
    },
  });
}

export function useUpdateNode() {
  const queryClient = useQueryClient();
  const updateNode = useGraphStore((s) => s.updateNode);

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Node> }) =>
      apiClient.updateNode(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: graphKeys.node(id) });
      const previousNode = queryClient.getQueryData(graphKeys.node(id));
      updateNode(id, updates);
      return { previousNode };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousNode) {
        queryClient.setQueryData(graphKeys.node(id), context.previousNode);
      }
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: graphKeys.node(id) });
      queryClient.invalidateQueries({ queryKey: graphKeys.data() });
    },
  });
}

export function useDeleteNode() {
  const queryClient = useQueryClient();
  const deleteNode = useGraphStore((s) => s.deleteNode);

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteNode(id),
    onSuccess: (_, id) => {
      deleteNode(id);
      queryClient.invalidateQueries({ queryKey: graphKeys.nodes() });
      queryClient.invalidateQueries({ queryKey: graphKeys.data() });
    },
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  const addLink = useGraphStore((s) => s.addLink);

  return useMutation({
    mutationFn: (link: Omit<Link, 'id'>) => apiClient.createLink(link),
    onSuccess: (newLink) => {
      addLink(newLink);
      queryClient.invalidateQueries({ queryKey: graphKeys.links() });
      queryClient.invalidateQueries({ queryKey: graphKeys.data() });
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  const deleteLink = useGraphStore((s) => s.deleteLink);

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteLink(id),
    onSuccess: (_, id) => {
      deleteLink(id);
      queryClient.invalidateQueries({ queryKey: graphKeys.links() });
      queryClient.invalidateQueries({ queryKey: graphKeys.data() });
    },
  });
}

export function useSearchNodes(query: string) {
  return useQuery({
    queryKey: graphKeys.search(query),
    queryFn: () => apiClient.searchNodes(query),
    enabled: query.length >= 2,
  });
}
