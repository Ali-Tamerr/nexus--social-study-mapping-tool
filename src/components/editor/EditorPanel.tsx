'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useGraphStore } from '@/store/useGraphStore';
import { X, Save, Trash2, Tag, Link2, Eye, Edit3, Users } from 'lucide-react';
import { cn, extractWikiLinks, generateExcerpt } from '@/lib/utils';
import type { Node } from '@/types/knowledge';
import { useUpdateNode, useDeleteNode, useCreateLink } from '@/hooks/useKnowledgeApi';
import { LinkSearchDropdown } from './LinkSearchDropdown';
import { usePresence } from '@/hooks/usePresence';

interface EditorPanelProps {
  node: Node;
}

export function EditorPanel({ node }: EditorPanelProps) {
  const [title, setTitle] = useState(node.title);
  const [content, setContent] = useState(node.content);
  const [tags, setTags] = useState(node.tags);
  const [newTag, setNewTag] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [showLinkDropdown, setShowLinkDropdown] = useState(false);
  const [linkSearchPosition, setLinkSearchPosition] = useState({ x: 0, y: 0 });
  const [linkSearchQuery, setLinkSearchQuery] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const updateNode = useUpdateNode();
  const deleteNode = useDeleteNode();
  const createLink = useCreateLink();
  
  const setActiveNode = useGraphStore((s) => s.setActiveNode);
  const toggleEditor = useGraphStore((s) => s.toggleEditor);
  const nodes = useGraphStore((s) => s.nodes);

  const { getNodeEditors } = usePresence(node.id);
  const editors = getNodeEditors(node.id);

  useEffect(() => {
    setTitle(node.title);
    setContent(node.content);
    setTags(node.tags);
  }, [node]);

  const handleSave = useCallback(() => {
    const excerpt = generateExcerpt(content);
    const wikiLinks = extractWikiLinks(content);
    
    updateNode.mutate({
      id: node.id,
      updates: { title, content, tags, excerpt },
    });

    wikiLinks.forEach((linkTitle) => {
      const targetNode = nodes.find(
        (n) => n.title.toLowerCase() === linkTitle.toLowerCase() && n.id !== node.id
      );
      if (targetNode) {
        createLink.mutate({
          source: node.id,
          target: targetNode.id,
          relationshipType: 'neutral',
        });
      }
    });
  }, [node.id, title, content, tags, nodes, updateNode, createLink]);

  const handleDelete = useCallback(() => {
    if (confirm('Are you sure you want to delete this node?')) {
      deleteNode.mutate(node.id);
      setActiveNode(null);
      toggleEditor(false);
    }
  }, [node.id, deleteNode, setActiveNode, toggleEditor]);

  const handleClose = useCallback(() => {
    setActiveNode(null);
    toggleEditor(false);
  }, [setActiveNode, toggleEditor]);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setContent(value);

    const textBeforeCursor = value.substring(0, cursorPos);
    const wikiLinkMatch = textBeforeCursor.match(/\[\[([^\]]*?)$/);

    if (wikiLinkMatch) {
      setLinkSearchQuery(wikiLinkMatch[1]);
      setShowLinkDropdown(true);

      if (textareaRef.current) {
        const rect = textareaRef.current.getBoundingClientRect();
        const lines = textBeforeCursor.split('\n');
        const lineHeight = 24;
        const y = rect.top + lines.length * lineHeight;
        const x = rect.left + 16;
        setLinkSearchPosition({ x, y: Math.min(y, rect.bottom - 200) });
      }
    } else {
      setShowLinkDropdown(false);
    }
  }, []);

  const handleLinkSelect = useCallback((selectedNode: Node) => {
    if (!textareaRef.current) return;

    const cursorPos = textareaRef.current.selectionStart;
    const textBeforeCursor = content.substring(0, cursorPos);
    const textAfterCursor = content.substring(cursorPos);
    const wikiLinkStart = textBeforeCursor.lastIndexOf('[[');

    const newContent =
      content.substring(0, wikiLinkStart) +
      `[[${selectedNode.title}]]` +
      textAfterCursor;

    setContent(newContent);
    setShowLinkDropdown(false);

    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = wikiLinkStart + selectedNode.title.length + 4;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
      }
    }, 0);
  }, [content]);

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  }, [newTag, tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  }, [tags]);

  const renderMarkdown = (text: string) => {
    return text
      .replace(/#{3}\s(.+)/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/#{2}\s(.+)/g, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
      .replace(/#{1}\s(.+)/g, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-400">$1</code>')
      .replace(/\[\[(.+?)\]\]/g, '<span class="text-violet-400 cursor-pointer hover:underline">$1</span>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-400 hover:underline" target="_blank">$1</a>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="flex h-full flex-col bg-zinc-900/95 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
          <span className="text-sm font-medium text-zinc-300">Editing Node</span>
          {editors.length > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
              <Users className="h-3 w-3" />
              <span>{editors.length} editing</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
              isPreview
                ? 'bg-violet-500/20 text-violet-400'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            )}
            title={isPreview ? 'Edit' : 'Preview'}
          >
            {isPreview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Node title..."
            className="w-full bg-transparent text-2xl font-bold text-white placeholder-zinc-600 outline-none"
          />

          <div className="flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-zinc-500" />
            {tags.map((tag) => (
              <span
                key={tag}
                className="group flex items-center gap-1 rounded-full bg-violet-500/20 px-2.5 py-1 text-xs text-violet-400"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add tag..."
              className="w-20 bg-transparent text-xs text-zinc-400 placeholder-zinc-600 outline-none"
            />
          </div>

          <div className="relative">
            {isPreview ? (
              <div
                className="prose prose-invert prose-sm min-h-[300px] max-w-none rounded-lg bg-zinc-800/50 p-4"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            ) : (
              <>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Start writing... Use [[link]] to connect to other nodes"
                  className="min-h-[300px] w-full resize-none rounded-lg bg-zinc-800/50 p-4 font-mono text-sm text-zinc-300 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-violet-500/50"
                />
                {showLinkDropdown && (
                  <LinkSearchDropdown
                    query={linkSearchQuery}
                    position={linkSearchPosition}
                    onSelect={handleLinkSelect}
                    onClose={() => setShowLinkDropdown(false)}
                  />
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Link2 className="h-3.5 w-3.5" />
            <span>
              {extractWikiLinks(content).length} wiki-links detected
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-3">
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
        <button
          onClick={handleSave}
          disabled={updateNode.isPending}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {updateNode.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
