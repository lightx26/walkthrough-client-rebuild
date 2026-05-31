'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import type { Walkthrough } from '@/types/walkthrough';
import { FileText, LayoutList, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useChapterExpand } from './chapter-expand-context';
import { computeDiffStats } from './diff-viewer';

function statusBadge(fileStatus: string) {
  const s = fileStatus?.toUpperCase();
  if (s === 'ADDED') return { label: 'A', cls: 'bg-green-100 text-green-700' };
  if (s === 'DELETED') return { label: 'D', cls: 'bg-red-100 text-red-700' };
  return { label: 'M', cls: 'bg-blue-100 text-blue-700' };
}

interface FilesPanelProps {
  walkthrough: Walkthrough;
}

export function FilesPanel({ walkthrough }: FilesPanelProps) {
  const [open, setOpen] = useState(false);
  const chapterExpand = useChapterExpand();

  const totalFiles = walkthrough.chapters.reduce((n, ch) => n + ch.files.length, 0);

  return (
    <>
      {/* Floating toggle button */}
      {!open && (
        <Button
          variant="outline"
          size="none"
          onClick={() => setOpen(true)}
          className="fixed top-1/2 right-6 z-30 -translate-y-1/2 gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 shadow-md hover:border-violet-400 hover:text-violet-700"
        >
          <LayoutList className="h-4 w-4" />
          <span>Files</span>
        </Button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed top-22 right-6 z-40 flex max-h-[calc(100vh-7rem)] w-72 flex-col rounded-xl border border-gray-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 px-4 py-3">
            <LayoutList className="h-4 w-4 text-gray-500" />
            <span className="flex-1 text-sm font-semibold text-gray-900">Walkthrough files</span>
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

          {/* File list */}
          <div className="flex-1 overflow-y-auto py-2">
            {walkthrough.chapters.map((chapter, chIdx) => (
              <div key={chapter.id}>
                {/* Chapter row */}
                <div className="flex items-center gap-2 px-4 py-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                    {chIdx + 1}
                  </span>
                  <span className="truncate text-xs font-medium text-gray-700">
                    {chapter.title}
                  </span>
                </div>

                {/* File rows */}
                {chapter.files.map((file) => {
                  const badge = statusBadge(file.fileStatus);
                  const stats = file.rawPatch ? computeDiffStats(file.rawPatch) : null;
                  const shortName = file.filename.split('/').pop() ?? file.filename;

                  return (
                    <Button
                      key={file.id}
                      variant="ghost"
                      size="none"
                      onClick={() => {
                        chapterExpand?.expandAndScrollToFile(chapter.id, file.id);
                      }}
                      className="group w-full justify-start gap-2 rounded-none py-1.5 pr-4 pl-10 font-normal hover:bg-violet-50"
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0 text-orange-400" />
                      <span className="flex-1 truncate font-mono text-xs text-gray-600 group-hover:text-violet-700">
                        {shortName}
                      </span>
                      <span
                        className={cn(
                          'shrink-0 rounded px-1 py-0.5 text-[10px] font-bold',
                          badge.cls
                        )}
                      >
                        {badge.label}
                      </span>
                      {stats && (
                        <span className="shrink-0 font-mono text-[10px] text-green-600">
                          +{stats.added}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Close button */}
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
