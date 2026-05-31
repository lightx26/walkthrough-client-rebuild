"use client";

import { useMemo, useState } from "react";
import { ChevronRight, FileText, FolderTree, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Walkthrough, WalkthroughFile } from "@/types/walkthrough";
import { computeDiffStats } from "./diff-viewer";
import { useChapterExpand } from "./chapter-expand-context";

function statusBadge(fileStatus: string) {
  const s = fileStatus?.toUpperCase();
  if (s === "ADDED") return { label: "A", cls: "bg-green-100 text-green-700" };
  if (s === "DELETED") return { label: "D", cls: "bg-red-100 text-red-700" };
  return { label: "M", cls: "bg-blue-100 text-blue-700" };
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
  const root = emptyNode("");
  walkthrough.chapters.forEach((chapter, chapterIndex) => {
    for (const file of chapter.files) {
      const parts = file.filename.split("/").filter(Boolean);
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
    if (child.leaves.length > 0 && child.children.size === 0)
      childLeaves.push(child);
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
        className="w-full justify-start gap-1 py-1 rounded-none font-normal hover:bg-violet-50"
        style={{ paddingLeft: 12 + depth * 12 }}
      >
        <ChevronRight
          className={cn(
            "w-3 h-3 text-gray-400 transition-transform shrink-0",
            open && "rotate-90",
          )}
        />
        <span className="text-xs font-medium text-gray-700 truncate">
          {node.name}
        </span>
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
            )),
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
  const stats = leaf.file.rawPatch
    ? computeDiffStats(leaf.file.rawPatch)
    : null;
  return (
    <Button
      variant="ghost"
      size="none"
      onClick={() => onFileClick(leaf.chapterId, leaf.file.id)}
      className="w-full justify-start gap-2 pr-4 py-1 rounded-none font-normal hover:bg-violet-50 group"
      style={{ paddingLeft: 12 + depth * 12 + 16 }}
    >
      <FileText className="w-3.5 h-3.5 text-orange-400 shrink-0" />
      <span className="text-xs text-gray-600 group-hover:text-violet-700 truncate flex-1 font-mono">
        {name}
      </span>
      <span
        className="text-[10px] font-semibold text-violet-700 bg-violet-100 rounded px-1 shrink-0"
        title={`Chapter ${leaf.chapterIndex + 1}`}
      >
        {leaf.chapterIndex + 1}
      </span>
      <span
        className={cn(
          "text-[10px] font-bold px-1 py-0.5 rounded shrink-0",
          badge.cls,
        )}
      >
        {badge.label}
      </span>
      {stats && (
        <span className="text-[10px] font-mono text-green-600 shrink-0">
          +{stats.added}
        </span>
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

  const totalFiles = walkthrough.chapters.reduce(
    (n, ch) => n + ch.files.length,
    0,
  );

  const topDirs: TreeNode[] = [];
  const topLeaves: TreeNode[] = [];
  for (const child of root.children.values()) {
    if (child.leaves.length > 0 && child.children.size === 0)
      topLeaves.push(child);
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
          className="fixed right-6 top-[calc(50%+3rem)] -translate-y-1/2 gap-1.5 px-3 py-2 shadow-md text-sm text-gray-600 hover:border-violet-400 hover:text-violet-700 font-medium z-30"
        >
          <FolderTree className="w-4 h-4" />
          <span>Tree</span>
        </Button>
      )}

      {open && (
        <div className="fixed right-6 top-22 z-40 w-80 bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col max-h-[calc(100vh-7rem)]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 shrink-0">
            <FolderTree className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-sm text-gray-900 flex-1">
              Original Tree
            </span>
            <span className="text-xs font-semibold text-white bg-blue-500 rounded-full px-1.5 py-0.5 min-w-5 text-center">
              {totalFiles}
            </span>
            <Button
              variant="ghost"
              size="none"
              onClick={() => setOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="overflow-y-auto flex-1 py-2">
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
              )),
            )}
          </div>

          <div className="border-t border-gray-100 px-4 py-3 shrink-0 flex justify-end">
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
