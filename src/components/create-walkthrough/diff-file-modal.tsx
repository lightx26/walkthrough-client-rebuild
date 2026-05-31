'use client';

import { useEffect } from 'react';

import { cn } from '@/lib/utils';
import type { PrFile } from '@/types/github';
import { FileText, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { computeDiffStats, parsePatch } from '@/components/walkthrough-detail';

import { useSyntaxHighlight } from '@/hooks/use-syntax-highlight';

import { baseName } from './file-utils';

function statusLabel(status: PrFile['status']) {
  switch (status) {
    case 'added':
      return { text: 'Added', cls: 'bg-green-100 text-green-700' };
    case 'removed':
      return { text: 'Removed', cls: 'bg-red-100 text-red-700' };
    case 'renamed':
      return { text: 'Renamed', cls: 'bg-purple-100 text-purple-700' };
    default:
      return { text: 'Modified', cls: 'bg-amber-100 text-amber-700' };
  }
}

function dirName(filename: string) {
  const slash = filename.lastIndexOf('/');
  return slash === -1 ? '' : filename.slice(0, slash);
}

interface Props {
  file: PrFile;
  onClose: () => void;
}

export function DiffFileModal({ file, onClose }: Props) {
  const badge = statusLabel(file.status);
  const stats = file.patch ? computeDiffStats(file.patch) : null;
  const lines = file.patch ? parsePatch(file.patch) : [];
  const dir = dirName(file.filename);
  const { tokens } = useSyntaxHighlight(file.patch, file.filename);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="mx-4 flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white pb-4 shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50">
            <FileText className="h-5 w-5 text-orange-500" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-semibold text-gray-900">
                {baseName(file.filename)}
              </span>
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', badge.cls)}>
                {badge.text}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-sm text-gray-400">
              {dir && <span className="font-mono">{dir}</span>}
              {stats && (
                <>
                  {dir && <span className="text-gray-300">·</span>}
                  <span className="font-mono text-green-600">+{stats.added}</span>
                  <span className="font-mono text-red-500">-{stats.removed}</span>
                </>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="iconSm"
            onClick={onClose}
            className="text-muted-foreground shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Diff content */}
        <div className="flex-1 overflow-auto">
          {lines.length === 0 ? (
            <p className="p-6 text-center text-sm text-gray-400">No diff available.</p>
          ) : (
            <table className="w-full table-fixed border-collapse font-mono text-xs">
              <tbody>
                {lines.map((line, i) => {
                  if (line.type === 'hunk') {
                    return (
                      <tr key={i} className="bg-blue-50">
                        <td className="w-10 border-r border-blue-100 px-2 py-0.5 text-right text-blue-400 select-none" />
                        <td className="w-10 border-r border-blue-100 px-2 py-0.5 text-right text-blue-400 select-none" />
                        <td className="px-3 py-0.5 text-blue-500">{line.content}</td>
                      </tr>
                    );
                  }

                  const rowBg = cn(
                    line.type === 'add' && 'bg-green-50',
                    line.type === 'del' && 'bg-red-50',
                    line.type === 'ctx' && 'bg-white'
                  );
                  const lineTokens = tokens?.get(i);
                  const textCls = lineTokens
                    ? undefined
                    : cn(
                        line.type === 'add' && 'text-green-700',
                        line.type === 'del' && 'text-red-700',
                        line.type === 'ctx' && 'text-gray-800'
                      );

                  return (
                    <tr key={i} className={rowBg}>
                      <td className="w-10 min-w-10 border-r border-gray-100 px-2 py-0.5 text-right text-gray-400 select-none">
                        {line.oldNo ?? ''}
                      </td>
                      <td className="w-10 min-w-10 border-r border-gray-100 px-2 py-0.5 text-right text-gray-400 select-none">
                        {line.newNo ?? ''}
                      </td>
                      <td className={cn('px-3 py-0.5 whitespace-pre', textCls)}>
                        <span className="mr-1 text-gray-400 select-none">
                          {line.type === 'add' ? '+' : line.type === 'del' ? '-' : ' '}
                        </span>
                        {lineTokens
                          ? lineTokens.map((token, j) => (
                              <span key={j} style={{ color: token.color }}>
                                {token.content}
                              </span>
                            ))
                          : line.content}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
