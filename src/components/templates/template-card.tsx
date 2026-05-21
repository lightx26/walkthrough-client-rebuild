"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Copy,
  LayoutTemplate,
  Lock,
  Pencil,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import {
  useDeleteTemplate,
  useDuplicateTemplate,
} from "@/hooks/use-templates";
import type { Template } from "@/types/template";
import { PrTypeBadge } from "./pr-type-badge";

interface Props {
  template: Template;
  defaultExpanded?: boolean;
}

export function TemplateCard({ template, defaultExpanded = false }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const deleteTemplate = useDeleteTemplate();
  const duplicateTemplate = useDuplicateTemplate();

  const isBuiltin = template.isBuiltin;
  const chapterCount = template.chapters?.length ?? 0;

  const onDelete = () => {
    if (!confirm(`Delete template "${template.name}"?`)) return;
    deleteTemplate.mutate(template.id);
  };

  const onDuplicate = () => {
    duplicateTemplate.mutate(
      { id: template.id },
      {
        onSuccess: (res) => {
          if (!isBuiltin) return;
          router.push(`/templates/${res.data.id}/edit`);
        },
      },
    );
  };

  return (
    <div
      className={cn(
        "bg-white border rounded-xl px-5 py-4 transition-colors",
        isBuiltin ? "border-gray-200 bg-gray-50/40" : "border-gray-200",
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-10 h-10 rounded-lg shrink-0 flex items-center justify-center",
            isBuiltin
              ? "bg-gray-100 text-gray-400"
              : "bg-violet-50 text-violet-500",
          )}
        >
          {isBuiltin ? (
            <Lock className="w-4 h-4" />
          ) : (
            <LayoutTemplate className="w-4 h-4" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {template.name}
            </h3>
            <PrTypeBadge prType={template.prType} />
          </div>
          {template.description && (
            <p className="text-sm text-gray-500 line-clamp-2">
              {template.description}
            </p>
          )}

          {!isBuiltin && (
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
              </span>
              <span>
                Updated{" "}
                {formatDistanceToNow(new Date(template.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isBuiltin ? (
            <>
              <button
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 hover:bg-gray-50 px-2.5 py-1.5 rounded-md transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Preview
              </button>
              <button
                onClick={onDuplicate}
                disabled={duplicateTemplate.isPending}
                className="inline-flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 hover:bg-gray-50 px-2.5 py-1.5 rounded-md transition-colors disabled:opacity-50"
              >
                <Copy className="w-3.5 h-3.5" />
                Duplicate to my templates
              </button>
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 ml-1">
                <Lock className="w-3 h-3" />
                Read-only
              </span>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push(`/templates/${template.id}/edit`)}
                className="inline-flex items-center gap-1.5 text-xs text-gray-700 border border-gray-200 hover:bg-gray-50 px-2.5 py-1.5 rounded-md transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={onDuplicate}
                disabled={duplicateTemplate.isPending}
                className="inline-flex items-center gap-1.5 text-xs text-gray-700 border border-gray-200 hover:bg-gray-50 px-2.5 py-1.5 rounded-md transition-colors disabled:opacity-50"
              >
                <Copy className="w-3.5 h-3.5" />
                Duplicate
              </button>
              <button
                onClick={onDelete}
                disabled={deleteTemplate.isPending}
                className="inline-flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 w-7 h-7 rounded-md transition-colors disabled:opacity-50"
                aria-label="Delete template"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {!isBuiltin && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 mt-3 ml-14 font-medium"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Hide chapters
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              Preview chapters
            </>
          )}
        </button>
      )}

      {expanded && template.chapters && template.chapters.length > 0 && (
        <ul className="mt-3 ml-14 space-y-2 border-t border-gray-100 pt-3">
          {template.chapters.map((chapter, idx) => (
            <li key={chapter.id} className="flex items-start gap-3">
              <span className="w-5 h-5 shrink-0 rounded-full bg-violet-100 text-violet-600 text-[10px] font-bold flex items-center justify-center mt-0.5">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {chapter.title}
                </p>
                {chapter.description && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {chapter.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
