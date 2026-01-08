'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api';
import type { PresenceState } from '@/types/knowledge';

export function usePresence(nodeId: string | null) {
  const [activeEditors, setActiveEditors] = useState<PresenceState[]>([]);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const sessionId = apiClient.getSessionId();

  const fetchPresence = useCallback(async () => {
    try {
      const presence = await apiClient.getPresence();
      setActiveEditors(presence.filter((p) => p.sessionId !== sessionId));
    } catch {
    }
  }, [sessionId]);

  const updatePresence = useCallback(async (editingNodeId: string | null) => {
    try {
      await apiClient.updatePresence(editingNodeId);
    } catch {
    }
  }, []);

  useEffect(() => {
    updatePresence(nodeId);

    fetchPresence();
    pollingRef.current = setInterval(fetchPresence, 5000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [nodeId, updatePresence, fetchPresence]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      apiClient.leavePresence();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const isNodeBeingEdited = useCallback(
    (checkNodeId: string) => {
      return activeEditors.some((editor) => editor.nodeId === checkNodeId);
    },
    [activeEditors]
  );

  const getNodeEditors = useCallback(
    (checkNodeId: string) => {
      return activeEditors.filter((editor) => editor.nodeId === checkNodeId);
    },
    [activeEditors]
  );

  return {
    activeEditors,
    isNodeBeingEdited,
    getNodeEditors,
    updatePresence,
  };
}
