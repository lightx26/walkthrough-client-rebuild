"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Copy,
  Lock,
  TrendingUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDuplicateTemplate } from "@/hooks/use-templates";
import type { Template } from "@/types/template";
import { PrTypeBadge } from "./pr-type-badge";

interface Props {
  open: boolean;
  templates: Template[];
  onClose: () => void;
}

export function BuiltInTemplatesDialog({ open, templates, onClose }: Props) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const duplicateTemplate = useDuplicateTemplate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const filtered = query
    ? templates.filter((t) =>
        (t.name + " " + (t.description ?? ""))
          .toLowerCase()
          .includes(query.toLowerCase()),
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
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-12 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-400" />
            <h2 className="font-semibold text-gray-900 text-base">
              Built-in templates
            </h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
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
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="px-6 pt-4">
          <p className="text-sm text-gray-500 mb-3">
            Provided by the system. Read-only — duplicate to create an editable
            copy.
          </p>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search built-in templates…"
            className="w-full text-sm text-gray-400 border border-gray-200 rounded-lg px-3 py-2 mb-3 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div className="px-6 pb-6 space-y-2 max-h-[60vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No templates match your search.
            </p>
          ) : (
            filtered.map((tpl) => {
              const isOpen = expandedId === tpl.id;
              return (
                <div
                  key={tpl.id}
                  className="border border-gray-200 rounded-lg bg-white"
                >
                  <div className="flex items-start gap-3 p-3">
                    <div className="w-8 h-8 rounded-md bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {tpl.name}
                        </p>
                        <PrTypeBadge prType={tpl.prType} />
                      </div>
                      {tpl.description && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {tpl.description}
                        </p>
                      )}
                      {tpl.duplicateCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-violet-600 mt-1">
                          <TrendingUp className="w-3 h-3" />
                          Duplicated {tpl.duplicateCount}{" "}
                          {tpl.duplicateCount === 1 ? "time" : "times"}
                        </span>
                      )}
                      <Button
                        variant="link"
                        size="none"
                        onClick={() => setExpandedId(isOpen ? null : tpl.id)}
                        className="gap-1 text-xs mt-2 font-medium no-underline hover:no-underline self-start"
                      >
                        {isOpen ? (
                          <>
                            <ChevronDown className="w-3 h-3" />
                            Hide chapters
                          </>
                        ) : (
                          <>
                            <ChevronRight className="w-3 h-3" />
                            Preview chapters
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => onDuplicate(tpl.id)}
                        disabled={duplicateTemplate.isPending}
                        className="gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Duplicate
                      </Button>
                    </div>
                  </div>

                  {tpl.chapters && tpl.chapters.length > 0 && (
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <ul className="px-3 pb-3 pl-14 space-y-1.5 border-t border-gray-100 pt-2">
                          {tpl.chapters.map((c, idx) => (
                            <li key={c.id} className={cn("flex items-start gap-2")}>
                              <span className="w-4 h-4 rounded-full bg-violet-100 text-violet-600 text-[9px] font-bold flex items-center justify-center mt-0.5 shrink-0">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-900">
                                  {c.title}
                                </p>
                                {c.description && (
                                  <p className="text-[11px] text-gray-500 mt-0.5">
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
