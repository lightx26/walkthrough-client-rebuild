"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  ArrowLeft,
  GripVertical,
  LayoutTemplate,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateTemplate, useUpdateTemplate } from "@/hooks/use-templates";
import type {
  CreateTemplateRequest,
  Template,
  TemplateChapterRequest,
  TemplatePrType,
} from "@/types/template";
import { PR_TYPE_OPTIONS } from "./pr-type-badge";
import { RequireAsterisk } from "../ui";
import { Button } from "@/components/ui/button";

const DRAG_TYPE_CHAPTER = "TEMPLATE_CHAPTER";

interface ChapterDragItem {
  type: typeof DRAG_TYPE_CHAPTER;
  index: number;
}

interface DraggableChapterProps {
  chapter: ChapterDraft;
  index: number;
  onRemove: () => void;
  onUpdate: (field: "title" | "description", value: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

function DraggableChapter({
  chapter,
  index,
  onRemove,
  onUpdate,
  onMove,
}: DraggableChapterProps) {
  const [{ isDragging }, drag, dragPreview] = useDrag<
    ChapterDragItem,
    void,
    { isDragging: boolean }
  >({
    type: DRAG_TYPE_CHAPTER,
    item: { type: DRAG_TYPE_CHAPTER, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop<ChapterDragItem, void>({
    accept: DRAG_TYPE_CHAPTER,
    hover(item) {
      if (item.index === index) return;
      onMove(item.index, index);
      item.index = index;
    },
  });

  const rowRef = useCallback(
    (node: HTMLDivElement | null) => {
      dragPreview(drop(node));
    },
    [dragPreview, drop],
  );

  const gripRef = useCallback(
    (node: HTMLDivElement | null) => {
      drag(node);
    },
    [drag],
  );

  return (
    <div
      ref={rowRef}
      className={cn(
        "bg-white border border-gray-200 rounded-xl px-4 py-4 transition-opacity",
        isDragging && "opacity-40",
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          ref={gripRef}
          className="cursor-grab active:cursor-grabbing p-0.5 shrink-0"
        >
          <GripVertical className="w-4 h-4 text-gray-300 hover:text-gray-500" />
        </div>
        <span className="w-7 h-7 rounded-md bg-violet-50 text-violet-600 text-xs font-bold flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        <input
          type="text"
          value={chapter.title}
          onChange={(e) => onUpdate("title", e.target.value)}
          placeholder="Chapter title"
          className="flex-1 text-gray-600 text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
        />
        <Button
          variant="destructiveGhost"
          size="iconSm"
          onClick={onRemove}
          aria-label="Remove chapter"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
      <div className="pl-[38px]">
        <textarea
          value={chapter.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="Guidance for the author — what should this chapter cover? (optional)"
          rows={2}
          className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 resize-none"
        />
      </div>
    </div>
  );
}

interface ChapterDraft {
  key: string;
  title: string;
  description: string;
}

interface Props {
  mode: "create" | "edit";
  initial?: Template;
}

let chapterKeySeq = 0;
const newKey = () => `c-${++chapterKeySeq}-${Date.now()}`;

export function TemplateForm({ mode, initial }: Props) {
  const router = useRouter();

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [prType, setPrType] = useState<TemplatePrType | "">(
    initial?.prType ?? "",
  );
  const [chapters, setChapters] = useState<ChapterDraft[]>(() => {
    if (initial?.chapters?.length) {
      return initial.chapters.map((c) => ({
        key: newKey(),
        title: c.title,
        description: c.description ?? "",
      }));
    }
    return [
      { key: newKey(), title: "", description: "" },
      { key: newKey(), title: "", description: "" },
    ];
  });

  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate(initial?.id ?? "");
  const isSaving = createTemplate.isPending || updateTemplate.isPending;

  const isValid = name.trim().length > 0;

  const addChapter = () => {
    setChapters((cs) => [...cs, { key: newKey(), title: "", description: "" }]);
  };

  const removeChapter = (key: string) => {
    setChapters((cs) => cs.filter((c) => c.key !== key));
  };

  const updateChapter = (
    key: string,
    field: "title" | "description",
    value: string,
  ) => {
    setChapters((cs) =>
      cs.map((c) => (c.key === key ? { ...c, [field]: value } : c)),
    );
  };

  const moveChapter = useCallback((fromIndex: number, toIndex: number) => {
    setChapters((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const onSubmit = () => {
    if (!isValid) return;
    const payload: CreateTemplateRequest = {
      name: name.trim(),
      description: description.trim() || null,
      prType: (prType || null) as TemplatePrType | null,
      chapters: chapters
        .filter((c) => c.title.trim().length > 0)
        .map<TemplateChapterRequest>((c, idx) => ({
          title: c.title.trim(),
          description: c.description.trim() || null,
          sortOrder: idx,
        })),
    };

    if (mode === "create") {
      createTemplate.mutate(payload, {
        onSuccess: () => router.push("/templates"),
      });
    } else {
      updateTemplate.mutate(payload, {
        onSuccess: () => router.push("/templates"),
      });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Sub-Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-200 bg-white shrink-0">
        <Button
          variant="muted"
          size="none"
          onClick={() => router.push("/templates")}
          className="gap-1.5 px-1 py-1 text-sm font-normal hover:bg-transparent shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Templates
        </Button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-600 text-white flex items-center justify-center">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <h1 className="text-[22px] font-bold text-gray-900">
              {mode === "create" ? "Create template" : "Edit template"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/templates")}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onSubmit}
              disabled={!isValid || isSaving}
              className="gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {mode === "create" ? "Create template" : "Save changes"}
            </Button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-6 py-5 mb-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-gray-500 mb-1.5">
              Template name <RequireAsterisk />
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Full-stack feature with frontend"
              className="w-full text-gray-600 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-gray-500 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What kind of PR is this template designed for? When should an author use it?"
              rows={3}
              className="w-full text-gray-600 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-gray-500 mb-1.5">
              PR type
            </label>
            <div className="relative">
              <select
                value={prType}
                onChange={(e) =>
                  setPrType(e.target.value as TemplatePrType | "")
                }
                className="w-full text-gray-400 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 bg-white appearance-none pr-8"
              >
                <option value="">— No type —</option>
                {PR_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {prType && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2 bg-white pl-0 pr-2">
                  <span className="text-sm text-gray-600">
                    {PR_TYPE_OPTIONS.find((o) => o.value === prType)?.label}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900 text-base">Chapters</h2>
            <span className="text-xs text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded font-semibold">
              {chapters.length}
            </span>
          </div>
          <span className="text-xs text-gray-400">Drag to reorder</span>
        </div>

        <div className="space-y-3 mb-4">
          {chapters.map((chapter, idx) => (
            <DraggableChapter
              key={chapter.key}
              chapter={chapter}
              index={idx}
              onRemove={() => removeChapter(chapter.key)}
              onUpdate={(field, value) =>
                updateChapter(chapter.key, field, value)
              }
              onMove={moveChapter}
            />
          ))}
        </div>

        <Button
          variant="dashed"
          size="none"
          onClick={addChapter}
          className="w-full gap-1.5 rounded-xl py-3 text-sm mb-4"
        >
          <Plus className="w-4 h-4" />
          Add chapter
        </Button>

        <div className="flex items-start gap-2.5 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
          <LayoutTemplate className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
          <p className="text-sm text-violet-700">
            Chapter titles and descriptions are pre-filled into the walkthrough
            builder. Authors can rename or delete them — the template is only a
            starting point.
          </p>
        </div>
      </div>
    </DndProvider>
  );
}
