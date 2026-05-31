'use client';

import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import type { Walkthrough, WalkthroughFile } from '@/types/walkthrough';
import { ChevronRight, FileText, FolderTree, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useChapterExpand } from './chapter-expand-context';
import { computeDiffStats } from './diff-viewer';

function statusBadge(fileStatus: string) {
  const s = fileStatus?.toUpperCase();
  if (s === 'ADDED') return { label: 'A', cls: 'bg-green-100 text-green-700' };
  if (s === 'DELETED') return { label: 'D', cls: 'bg-red-100 text-red-700' };
  return { label: 'M', cls: 'bg-blue-100 text-blue-700' };
}

interface LeafEntry {
  file: WalkthroughFile;
  chapterIndex: number;
  chapterId: string;
}

interface TreeNode {
  name: string;
  children: Map<string, TreeNode>;
  leaves: LeafEntry[];
}

function emptyNode(name: string): TreeNode {
  return { name, children: new Map(), leaves: [] };
}

function buildTree(walkthrough: Walkthrough): TreeNode {
  const root = emptyNode('');
  walkthrough.chapters.forEach((chapter, chapterIndex) => {
    for (const file of chapter.files) {
      const parts = file.filename.split('/').filter(Boolean);
      if (parts.length === 0) continue;
      let node = root;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        let child = node.children.get(part);
        if (!child) {
          child = emptyNode(part);
          node.children.set(part, child);
        }
        node = child;
      }
      const leafName = parts[parts.length - 1];
      let leafNode = node.children.get(leafName);
      if (!leafNode) {
        leafNode = emptyNode(leafName);
        node.children.set(leafName, leafNode);
      }
      leafNode.leaves.push({ file, chapterIndex, chapterId: chapter.id });
    }
  });
  collapseChains(root);
  return root;
}

// Collapse single-child directory chains: a/ -> b/ -> c.ts becomes a/b/c.ts.
function collapseChains(node: TreeNode) {
  const entries = Array.from(node.children.entries());
  node.children.clear();
  for (const [, child] of entries) {
    while (child.leaves.length === 0 && child.children.size === 1) {
      const only = child.children.values().next().value as TreeNode;
      child.name = `${child.name}/${only.name}`;
      child.children = only.children;
      child.leaves = only.leaves;
    }
    collapseChains(child);
    node.children.set(child.name, child);
  }
}

interface DirRowProps {
  node: TreeNode;
  depth: number;
  onFileClick: (chapterId: string, fileId: string) => void;
}

function DirNode({ node, depth, onFileClick }: DirRowProps) {
  const [open, setOpen] = useState(true);
  const childDirs: TreeNode[] = [];
  const childLeaves: TreeNode[] = [];
  for (const child of node.children.values()) {
    if (child.leaves.length > 0 && child.children.size === 0) childLeaves.push(child);
    else childDirs.push(child);
  }
  childDirs.sort((a, b) => a.name.localeCompare(b.name));
  childLeaves.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <Button
        variant="ghost"
        size="none"
        onClick={() => setOpen((v) => !v)}
        className="w-full justify-start gap-1 rounded-none py-1 font-normal hover:bg-violet-50"
        style={{ paddingLeft: 12 + depth * 12 }}
      >
        <ChevronRight
          className={cn('h-3 w-3 shrink-0 text-gray-400 transition-transform', open && 'rotate-90')}
        />
        <span className="truncate text-xs font-medium text-gray-700">{node.name}</span>
      </Button>
      {open && (
        <>
          {childDirs.map((child) => (
            <DirNode key={child.name} node={child} depth={depth + 1} onFileClick={onFileClick} />
          ))}
          {childLeaves.map((child) =>
            child.leaves.map((leaf) => (
              <FileLeaf
                key={leaf.file.id}
                name={child.name}
                leaf={leaf}
                depth={depth + 1}
                onFileClick={onFileClick}
              />
            ))
          )}
        </>
      )}
    </div>
  );
}

interface FileLeafProps {
  name: string;
  leaf: LeafEntry;
  depth: number;
  onFileClick: (chapterId: string, fileId: string) => void;
}

function FileLeaf({ name, leaf, depth, onFileClick }: FileLeafProps) {
  const badge = statusBadge(leaf.file.fileStatus);
  const stats = leaf.file.rawPatch ? computeDiffStats(leaf.file.rawPatch) : null;
  return (
    <Button
      variant="ghost"
      size="none"
      onClick={() => onFileClick(leaf.chapterId, leaf.file.id)}
      className="group w-full justify-start gap-2 rounded-none py-1 pr-4 font-normal hover:bg-violet-50"
      style={{ paddingLeft: 12 + depth * 12 + 16 }}
    >
      <FileText className="h-3.5 w-3.5 shrink-0 text-orange-400" />
      <span className="flex-1 truncate font-mono text-xs text-gray-600 group-hover:text-violet-700">
        {name}
      </span>
      <span
        className="shrink-0 rounded bg-violet-100 px-1 text-[10px] font-semibold text-violet-700"
        title={`Chapter ${leaf.chapterIndex + 1}`}
      >
        {leaf.chapterIndex + 1}
      </span>
      <span className={cn('shrink-0 rounded px-1 py-0.5 text-[10px] font-bold', badge.cls)}>
        {badge.label}
      </span>
      {stats && (
        <span className="shrink-0 font-mono text-[10px] text-green-600">+{stats.added}</span>
      )}
    </Button>
  );
}

interface FileTreePanelProps {
  walkthrough: Walkthrough;
}

export function FileTreePanel({ walkthrough }: FileTreePanelProps) {
  const [open, setOpen] = useState(false);
  const chapterExpand = useChapterExpand();
  const root = useMemo(() => buildTree(walkthrough), [walkthrough]);

  const handleFileClick = (chapterId: string, fileId: string) => {
    chapterExpand?.expandAndScrollToFile(chapterId, fileId);
  };

  const totalFiles = walkthrough.chapters.reduce((n, ch) => n + ch.files.length, 0);

  const topDirs: TreeNode[] = [];
  const topLeaves: TreeNode[] = [];
  for (const child of root.children.values()) {
    if (child.leaves.length > 0 && child.children.size === 0) topLeaves.push(child);
    else topDirs.push(child);
  }
  topDirs.sort((a, b) => a.name.localeCompare(b.name));
  topLeaves.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      {!open && (
        <Button
          variant="outline"
          size="none"
          onClick={() => setOpen(true)}
          className="fixed top-[calc(50%+3rem)] right-6 z-30 -translate-y-1/2 gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 shadow-md hover:border-violet-400 hover:text-violet-700"
        >
          <FolderTree className="h-4 w-4" />
          <span>Tree</span>
        </Button>
      )}

      {open && (
        <div className="fixed top-22 right-6 z-40 flex max-h-[calc(100vh-7rem)] w-80 flex-col rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 px-4 py-3">
            <FolderTree className="h-4 w-4 text-gray-500" />
            <span className="flex-1 text-sm font-semibold text-gray-900">Original Tree</span>
            <span className="min-w-5 rounded-full bg-blue-500 px-1.5 py-0.5 text-center text-xs font-semibold text-white">
              {totalFiles}
            </span>
            <Button
              variant="ghost"
              size="none"
              onClick={() => setOpen(false)}
              className="ml-1 p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {topDirs.map((node) => (
              <DirNode key={node.name} node={node} depth={0} onFileClick={handleFileClick} />
            ))}
            {topLeaves.map((child) =>
              child.leaves.map((leaf) => (
                <FileLeaf
                  key={leaf.file.id}
                  name={child.name}
                  leaf={leaf}
                  depth={0}
                  onFileClick={handleFileClick}
                />
              ))
            )}
          </div>

          <div className="flex shrink-0 justify-end border-t border-gray-100 px-4 py-3">
            <Button
              variant="primary"
              size="xs"
              onClick={() => setOpen(false)}
              className="rounded-lg"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
