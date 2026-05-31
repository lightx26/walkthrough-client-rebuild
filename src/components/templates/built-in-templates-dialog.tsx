'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import type { Template } from '@/types/template';
import { ChevronDown, ChevronRight, Copy, Lock, TrendingUp, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useDuplicateTemplate } from '@/hooks/use-templates';

import { PrTypeBadge } from './pr-type-badge';

interface Props {
  open: boolean;
  templates: Template[];
  onClose: () => void;
}

export function BuiltInTemplatesDialog({ open, templates, onClose }: Props) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const duplicateTemplate = useDuplicateTemplate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const filtered = query
    ? templates.filter((t) =>
        (t.name + ' ' + (t.description ?? '')).toLowerCase().includes(query.toLowerCase())
      )
    : templates;

  const onDuplicate = (id: string) => {
    duplicateTemplate.mutate(
      { id },
      {
        onSuccess: (res) => {
          onClose();
          router.push(`/templates/${res.data.id}/edit`);
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-12"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">Built-in templates</h2>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-400">
              {templates.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onClose}
            className="text-muted-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-6 pt-4">
          <p className="mb-3 text-sm text-gray-500">
            Provided by the system. Read-only — duplicate to create an editable copy.
          </p>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search built-in templates…"
            className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-400 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div className="max-h-[60vh] space-y-2 overflow-y-auto px-6 pb-6">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No templates match your search.
            </p>
          ) : (
            filtered.map((tpl) => {
              const isOpen = expandedId === tpl.id;
              return (
                <div key={tpl.id} className="rounded-lg border border-gray-200 bg-white">
                  <div className="flex items-start gap-3 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                      <Lock className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="mb-0.5 flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-gray-900">{tpl.name}</p>
                        <PrTypeBadge prType={tpl.prType} />
                      </div>
                      {tpl.description && (
                        <p className="line-clamp-2 text-xs text-gray-500">{tpl.description}</p>
                      )}
                      {tpl.duplicateCount > 0 && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-violet-600">
                          <TrendingUp className="h-3 w-3" />
                          Duplicated {tpl.duplicateCount}{' '}
                          {tpl.duplicateCount === 1 ? 'time' : 'times'}
                        </span>
                      )}
                      <Button
                        variant="link"
                        size="none"
                        onClick={() => setExpandedId(isOpen ? null : tpl.id)}
                        className="mt-2 gap-1 self-start text-xs font-medium no-underline hover:no-underline"
                      >
                        {isOpen ? (
                          <>
                            <ChevronDown className="h-3 w-3" />
                            Hide chapters
                          </>
                        ) : (
                          <>
                            <ChevronRight className="h-3 w-3" />
                            Preview chapters
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => onDuplicate(tpl.id)}
                        disabled={duplicateTemplate.isPending}
                        className="gap-1.5 rounded-xl"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Duplicate
                      </Button>
                    </div>
                  </div>

                  {tpl.chapters && tpl.chapters.length > 0 && (
                    <div
                      className={cn(
                        'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out',
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      )}
                    >
                      <div className="overflow-hidden">
                        <ul className="space-y-1.5 border-t border-gray-100 px-3 pt-2 pb-3 pl-14">
                          {tpl.chapters.map((c, idx) => (
                            <li key={c.id} className={cn('flex items-start gap-2')}>
                              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[9px] font-bold text-violet-600">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-900">{c.title}</p>
                                {c.description && (
                                  <p className="mt-0.5 text-[11px] text-gray-500">
                                    {c.description}
                                  </p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
