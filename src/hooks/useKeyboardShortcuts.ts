'use client';

import { useEffect, useCallback } from 'react';
import { useGraphStore } from '@/store/useGraphStore';

type KeyCombo = {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
};

type KeyHandler = {
  combo: KeyCombo;
  handler: () => void;
  description: string;
};

export function useKeyboardShortcuts() {
  const toggleCommandPalette = useGraphStore((s) => s.toggleCommandPalette);
  const toggleEditor = useGraphStore((s) => s.toggleEditor);
  const activeNode = useGraphStore((s) => s.activeNode);
  const setActiveNode = useGraphStore((s) => s.setActiveNode);

  const shortcuts: KeyHandler[] = [
    {
      combo: { key: 'k', ctrl: true },
      handler: () => toggleCommandPalette(),
      description: 'Open command palette',
    },
    {
      combo: { key: 'k', meta: true },
      handler: () => toggleCommandPalette(),
      description: 'Open command palette (Mac)',
    },
    {
      combo: { key: 'Escape' },
      handler: () => {
        toggleCommandPalette(false);
        if (activeNode) {
          toggleEditor(false);
          setActiveNode(null);
        }
      },
      description: 'Close panels',
    },
    {
      combo: { key: 'n', ctrl: true, shift: true },
      handler: () => toggleCommandPalette(true),
      description: 'New node',
    },
  ];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        if (event.key === 'Escape') {
          (event.target as HTMLElement).blur();
        }
        return;
      }

      for (const { combo, handler } of shortcuts) {
        const ctrlMatch = combo.ctrl ? event.ctrlKey : !event.ctrlKey || combo.meta;
        const metaMatch = combo.meta ? event.metaKey : !event.metaKey || combo.ctrl;
        const shiftMatch = combo.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = combo.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === combo.key.toLowerCase();

        if (keyMatch && (ctrlMatch || metaMatch) && shiftMatch && altMatch) {
          event.preventDefault();
          handler();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts;
}
