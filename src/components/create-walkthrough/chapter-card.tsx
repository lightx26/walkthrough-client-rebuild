'use client';

import { useRef } from 'react';

import { cn } from '@/lib/utils';
import type { PrFile } from '@/types/github';
import { FileText, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';

import { Button } from '@/components/ui/button';

import { ChapterFileRow, DRAG_TYPE_CHAPTER_FILE, type DragItem } from './chapter-file-row';
import { DRAG_TYPE_PR_DIR, DRAG_TYPE_PR_FILE } from './file-utils';

export const DRAG_TYPE_CHAPTER = 'CHAPTER';

export interface ChapterDraft {
  id: string;
  title: string;
  description: string;
  files: PrFile[];
}

interface ChapterDragItem {
  type: typeof DRAG_TYPE_CHAPTER;
  chapterId: string;
  index: number;
}

interface ChapterCardProps {
  chapter: ChapterDraft;
  index: number;
  onChange: (updated: ChapterDraft) => void;
  onViewFileDiff: (file: PrFile) => void;
  onDelete?: () => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function ChapterCard({
  chapter,
  index,
  onChange,
  onViewFileDiff,
  onDelete,
  onReorder,
}: ChapterCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const gripRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // Chapter-level drag
  const [{ isDragging }, drag, dragPreview] = useDrag<ChapterDragItem, void, { isDragging: boolean }>({
    type: DRAG_TYPE_CHAPTER,
    item: { type: DRAG_TYPE_CHAPTER, chapterId: chapter.id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  // Chapter-level drop (for reordering chapters)
  const [, dropChapter] = useDrop<ChapterDragItem, void>({
    accept: DRAG_TYPE_CHAPTER,
    hover(item) {
      if (item.chapterId === chapter.id) return;
      onReorder(item.index, index);
      item.index = index;
    },
  });

  // File drop zone
  const [{ isOver }, dropFiles] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: [DRAG_TYPE_PR_FILE, DRAG_TYPE_PR_DIR, DRAG_TYPE_CHAPTER_FILE],
    drop(item) {
      if (item.type === DRAG_TYPE_PR_FILE) {
        if (chapter.files.find((f) => f.filename === item.file.filename)) return;
        onChange({ ...chapter, files: [...chapter.files, item.file] });
      } else if (item.type === DRAG_TYPE_PR_DIR) {
        const existing = new Set(chapter.files.map((f) => f.filename));
        const toAdd = item.files.filter((f) => !existing.has(f.filename));
        if (toAdd.length === 0) return;
        onChange({ ...chapter, files: [...chapter.files, ...toAdd] });
      } else if (item.type === DRAG_TYPE_CHAPTER_FILE && item.chapterId !== chapter.id) {
        if (chapter.files.find((f) => f.filename === item.file.filename)) return;
        onChange({ ...chapter, files: [...chapter.files, item.file] });
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  dropChapter(dragPreview(cardRef));
  drag(gripRef);
  dropFiles(dropRef);

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const updated = [...chapter.files];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange({ ...chapter, files: updated });
  };

  const handleRemoveFile = (filename: string) => {
    onChange({
      ...chapter,
      files: chapter.files.filter((f) => f.filename !== filename),
    });
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'overflow-hidden rounded-xl border border-gray-200 bg-white transition-opacity',
        isDragging && 'opacity-40'
      )}
    >
      {/* Chapter header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3.5">
        <div ref={gripRef} className="shrink-0 cursor-grab p-0.5 active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-gray-300 hover:text-gray-500" />
        </div>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
          {index + 1}
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="shrink-0 text-sm font-medium text-gray-500">Chapter {index + 1}</span>
        </div>
        {chapter.files.length > 0 && (
          <span className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
            <FileText className="h-3.5 w-3.5" />
            {chapter.files.length} {chapter.files.length === 1 ? 'file' : 'files'}
          </span>
        )}
        {onDelete && (
          <Button
            variant="destructiveGhost"
            size="none"
            onClick={onDelete}
            className="shrink-0 p-1 text-gray-300 hover:bg-transparent"
            title="Delete chapter"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Title & description */}
      <div className="space-y-2 px-4 pt-3 pb-2">
        <input
          type="text"
          placeholder="Chapter title..."
          value={chapter.title}
          onChange={(e) => onChange({ ...chapter, title: e.target.value })}
          className="w-full border-b border-transparent bg-transparent pb-1 text-sm font-medium text-gray-900 transition-colors outline-none placeholder:text-gray-400 focus:border-gray-200"
        />
        <textarea
          placeholder="What does this chapter explain? Give reviewers context..."
          value={chapter.description}
          onChange={(e) => onChange({ ...chapter, description: e.target.value })}
          rows={2}
          className="w-full resize-none bg-transparent text-sm leading-relaxed text-gray-600 outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Diff files section */}
      <div className="px-4 pb-4">
        {chapter.files.length > 0 && (
          <div className="mb-2">
            <p className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Diff files · {chapter.files.length}
            </p>
            <div className="space-y-1.5">
              {chapter.files.map((file, i) => (
                <ChapterFileRow
                  key={file.filename}
                  file={file}
                  index={i}
                  chapterId={chapter.id}
                  onRemove={() => handleRemoveFile(file.filename)}
                  onViewDiff={() => onViewFileDiff(file)}
                  onReorder={handleReorder}
                />
              ))}
            </div>
          </div>
        )}

        {/* Drop zone for files */}
        <div
          ref={dropRef}
          className={cn(
            'flex items-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 transition-colors',
            isOver ? 'border-violet-400 bg-violet-50' : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <Plus className={cn('h-4 w-4 shrink-0', isOver ? 'text-violet-500' : 'text-gray-400')} />
          <span className={cn('text-sm', isOver ? 'text-violet-600' : 'text-gray-400')}>
            {isOver ? 'Drop file here' : 'Drag more files here'}
          </span>
        </div>
      </div>
    </div>
  );
}
