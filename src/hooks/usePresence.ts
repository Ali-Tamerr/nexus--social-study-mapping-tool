'use client';

import { useState, useCallback } from 'react';
import type { PresenceState } from '@/types/knowledge';

export function usePresence(_nodeId: string | null) {
  const [activeEditors] = useState<PresenceState[]>([]);

  const isNodeBeingEdited = useCallback(
    (_checkNodeId: string) => {
      return false;
    },
    []
  );

  const getNodeEditors = useCallback(
    (_checkNodeId: string): PresenceState[] => {
      return [];
    },
    []
  );

  const updatePresence = useCallback(async (_editingNodeId: string | null) => {
  }, []);

  return {
    activeEditors,
    isNodeBeingEdited,
    getNodeEditors,
    updatePresence,
  };
}
