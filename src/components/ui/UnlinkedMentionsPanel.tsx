'use client';

import { useGraphStore } from '@/store/useGraphStore';
import { useCreateLink } from '@/hooks/useKnowledgeApi';
import { X, Link2, ArrowRight, Sparkles } from 'lucide-react';

interface UnlinkedMentionsPanelProps {
  onClose: () => void;
}

export function UnlinkedMentionsPanel({ onClose }: UnlinkedMentionsPanelProps) {
  const unlinkedMentions = useGraphStore((s) => s.unlinkedMentions);
  const findUnlinkedMentions = useGraphStore((s) => s.findUnlinkedMentions);
  const createLink = useCreateLink();

  const handleCreateLink = (sourceId: string, targetId: string) => {
    createLink.mutate(
      {
        source: sourceId,
        target: targetId,
        relationshipType: 'neutral',
      },
      {
        onSuccess: () => {
          findUnlinkedMentions();
        },
      }
    );
  };

  return (
    <div className="border-t border-zinc-800 bg-amber-500/5">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium text-amber-400">Unlinked Mentions</span>
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs">
            {unlinkedMentions.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-48 overflow-y-auto">
        {unlinkedMentions.map((mention, index) => (
          <div
            key={`${mention.sourceNodeId}-${mention.targetNodeId}-${index}`}
            className="border-b border-zinc-800/50 px-4 py-3 last:border-b-0"
          >
            <div className="mb-2 flex items-center gap-2 text-xs">
              <span className="font-medium text-white">{mention.sourceNodeTitle}</span>
              <ArrowRight className="h-3 w-3 text-zinc-600" />
              <span className="text-violet-400">{mention.targetNodeTitle}</span>
            </div>
            <p className="mb-2 text-xs text-zinc-500 line-clamp-2">
              ...{mention.context}...
            </p>
            <button
              onClick={() => handleCreateLink(mention.sourceNodeId, mention.targetNodeId)}
              disabled={createLink.isPending}
              className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
            >
              <Link2 className="h-3 w-3" />
              Create Link
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
