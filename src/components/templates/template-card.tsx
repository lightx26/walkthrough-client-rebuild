'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import type { Template } from '@/types/template';
import { formatDistanceToNow } from 'date-fns';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  LayoutTemplate,
  Lock,
  Pencil,
  Trash2,
  TrendingUp,
  Waypoints,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

import { useDeleteTemplate, useDuplicateTemplate } from '@/hooks/use-templates';

import { PrTypeBadge } from './pr-type-badge';

interface Props {
  template: Template;
  defaultExpanded?: boolean;
}

export function TemplateCard({ template, defaultExpanded = false }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteTemplate = useDeleteTemplate();
  const duplicateTemplate = useDuplicateTemplate();

  const isBuiltin = template.isBuiltin;
  const chapterCount = template.chapters?.length ?? 0;

  const onDuplicate = () => {
    duplicateTemplate.mutate(
      { id: template.id },
      {
        onSuccess: (res) => {
          if (!isBuiltin) return;
          router.push(`/templates/${res.data.id}/edit`);
        },
      }
    );
  };

  return (
    <div
      className={cn(
        'rounded-xl border bg-white px-5 py-4 transition-colors',
        isBuiltin ? 'border-gray-200 bg-gray-50/40' : 'border-gray-200'
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg',
            isBuiltin ? 'bg-gray-100 text-gray-400' : 'bg-violet-50 text-violet-500'
          )}
        >
          {isBuiltin ? <Lock className="h-4 w-4" /> : <LayoutTemplate className="h-4 w-4" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-gray-900">{template.name}</h3>
            <PrTypeBadge prType={template.prType} />
          </div>
          {template.description && (
            <p className="line-clamp-2 text-sm text-gray-500">{template.description}</p>
          )}

          {isBuiltin && template.duplicateCount > 0 && (
            <span className="mt-1.5 inline-flex items-center gap-1 text-xs text-violet-600">
              <TrendingUp className="h-3 w-3" />
              Duplicated {template.duplicateCount}{' '}
              {template.duplicateCount === 1 ? 'time' : 'times'}
            </span>
          )}

          {!isBuiltin && (
            <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Waypoints className="h-3 w-3" />
                {chapterCount} {chapterCount === 1 ? 'chapter' : 'chapters'}
              </span>
              <span>
                Updated{' '}
                {formatDistanceToNow(new Date(template.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {isBuiltin ? (
            <>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setExpanded((v) => !v)}
                className="gap-1.5"
              >
                <Waypoints className="h-3.5 w-3.5" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={onDuplicate}
                disabled={duplicateTemplate.isPending}
                className="gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                Duplicate to my templates
              </Button>
              <span className="ml-1 inline-flex items-center gap-1 text-[10px] text-gray-400">
                <Lock className="h-3 w-3" />
                Read-only
              </span>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="xs"
                onClick={() => router.push(`/templates/${template.id}/edit`)}
                className="gap-1.5 rounded-xl px-3.5"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={onDuplicate}
                disabled={duplicateTemplate.isPending}
                className="gap-1.5 rounded-xl px-3.5"
              >
                <Copy className="h-3.5 w-3.5" />
                Duplicate
              </Button>
              <Button
                variant="destructiveGhost"
                size="iconSm"
                onClick={() => setConfirmDelete(true)}
                disabled={deleteTemplate.isPending}
                className="h-7 w-7 rounded-xl"
                aria-label="Delete template"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {!isBuiltin && (
        <Button
          variant="link"
          size="none"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 ml-14 gap-1 text-xs font-medium no-underline hover:no-underline"
        >
          {expanded ? (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              Hide chapters
            </>
          ) : (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              Preview chapters
            </>
          )}
        </Button>
      )}

      {template.chapters && template.chapters.length > 0 && (
        <div
          className={cn(
            'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out',
            expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          )}
        >
          <div className="overflow-hidden">
            <ul className="mt-3 ml-14 space-y-2 border-t border-gray-100 pt-3">
              {template.chapters.map((chapter, idx) => (
                <li key={chapter.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-600">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{chapter.title}</p>
                    {chapter.description && (
                      <p className="mt-0.5 text-xs text-gray-500">{chapter.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete "${template.name}"?`}
        description="This template will be permanently removed. This action cannot be undone."
        tone="danger"
        confirmLabel="Delete"
        onConfirm={() => {
          setConfirmDelete(false);
          deleteTemplate.mutate(template.id);
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
