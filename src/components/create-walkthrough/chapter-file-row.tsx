'use client';

import { useRef } from 'react';

import { cn } from '@/lib/utils';
import type { PrFile } from '@/types/github';
import { Eye, FileCode2, FileText, GripVertical, X } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';

import { Button } from '@/components/ui/button';

import { DRAG_TYPE_PR_DIR, DRAG_TYPE_PR_FILE, baseName, statusBadge } from './file-utils';

export const DRAG_TYPE_CHAPTER_FILE = 'CHAPTER_FILE';

export interface PrFileDragItem {
  type: typeof DRAG_TYPE_PR_FILE;
  file: PrFile;
}

export interface PrDirDragItem {
  type: typeof DRAG_TYPE_PR_DIR;
  dir: string;
  files: PrFile[];
}

export interface ChapterFileDragItem {
  type: typeof DRAG_TYPE_CHAPTER_FILE;
  chapterId: string;
  fileIndex: number;
  file: PrFile;
}

export type DragItem = PrFileDragItem | PrDirDragItem | ChapterFileDragItem;

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'sql') return <FileCode2 className="h-4 w-4 shrink-0 text-blue-500" />;
  return <FileText className="h-4 w-4 shrink-0 text-orange-400" />;
}

function dirName(filename: string) {
  const slash = filename.lastIndexOf('/');
  return slash === -1 ? null : filename.slice(0, slash + 1);
}

interface ChapterFileRowProps {
  file: PrFile;
  index: number;
  chapterId: string;
  onRemove: () => void;
  onViewDiff: () => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function ChapterFileRow({
  file,
  index,
  chapterId,
  onRemove,
  onViewDiff,
  onReorder,
}: ChapterFileRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const gripRef = useRef<HTMLDivElement>(null);
  const badge = statusBadge(file.status);
  const dir = dirName(file.filename);

  const [{ isDragging }, drag, dragPreview] = useDrag<
    ChapterFileDragItem,
    void,
    { isDragging: boolean }
  >({
    type: DRAG_TYPE_CHAPTER_FILE,
    item: { type: DRAG_TYPE_CHAPTER_FILE, chapterId, fileIndex: index, file },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop<ChapterFileDragItem, void>({
    accept: DRAG_TYPE_CHAPTER_FILE,
    hover(item) {
      if (item.chapterId !== chapterId) return;
      if (item.fileIndex === index) return;
      onReorder(item.fileIndex, index);
      item.fileIndex = index;
    },
  });

  drop(rowRef);
  dragPreview(rowRef);
  drag(gripRef);

  return (
    <div
      ref={rowRef}
      className={cn(
        'group flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2 transition-opacity',
        isDragging && 'opacity-40'
      )}
    >
      <span className="w-4 shrink-0 text-center text-xs text-gray-400 select-none">
        {index + 1}
      </span>
      <div ref={gripRef} className="shrink-0 cursor-grab p-0.5 active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-gray-300 hover:text-gray-500" />
      </div>
      {getFileIcon(file.filename)}
      <Button
        variant="link"
        size="none"
        className="min-w-0 flex-1 justify-start text-left no-underline"
        onClick={onViewDiff}
      >
        <span className="block truncate text-sm font-medium hover:underline">
          {baseName(file.filename)}
        </span>
      </Button>
      {dir && (
        <span className="hidden max-w-[120px] shrink-0 truncate font-mono text-xs text-gray-400 sm:block">
          {dir}
        </span>
      )}
      {(file.additions > 0 || file.deletions > 0) && (
        <span className="shrink-0 font-mono text-xs">
          <span className="text-green-600">+{file.additions}</span>{' '}
          <span className="text-red-500">-{file.deletions}</span>
        </span>
      )}
      <span className={cn('shrink-0 rounded px-1 py-0.5 text-[10px] font-bold', badge.cls)}>
        {badge.label}
      </span>
      <Button
        variant="ghost"
        size="none"
        onClick={onViewDiff}
        className="shrink-0 p-1 text-gray-300 hover:bg-transparent hover:text-gray-500"
        title="View diff"
      >
        <Eye className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="destructiveGhost"
        size="none"
        onClick={onRemove}
        className="shrink-0 p-1 text-gray-300 hover:bg-transparent"
        title="Remove"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
