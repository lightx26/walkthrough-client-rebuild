"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ArrowLeft, LayoutTemplate, Save } from "lucide-react";
import { useCreateTemplate, useUpdateTemplate } from "@/hooks/use-templates";
import type {
  CreateTemplateRequest,
  Template,
  TemplateChapterRequest,
  TemplatePrType,
} from "@/types/template";
import { Button } from "@/components/ui/button";
import type { ChapterDraft } from "./template-form-types";
import { newChapterKey } from "./template-form-types";
import { TemplateFormFields } from "./template-form-fields";
import { TemplateFormChapters } from "./template-form-chapters";

interface Props {
  mode: "create" | "edit";
  initial?: Template;
}

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
        key: newChapterKey(),
        title: c.title,
        description: c.description ?? "",
      }));
    }
    return [
      { key: newChapterKey(), title: "", description: "" },
      { key: newChapterKey(), title: "", description: "" },
    ];
  });

  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate(initial?.id ?? "");
  const isSaving = createTemplate.isPending || updateTemplate.isPending;

  const isValid = name.trim().length > 0;

  const addChapter = () => {
    setChapters((cs) => [
      ...cs,
      { key: newChapterKey(), title: "", description: "" },
    ]);
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

        <TemplateFormFields
          name={name}
          onNameChange={setName}
          description={description}
          onDescriptionChange={setDescription}
          prType={prType}
          onPrTypeChange={setPrType}
        />

        <TemplateFormChapters
          chapters={chapters}
          onRemove={removeChapter}
          onUpdate={updateChapter}
          onMove={moveChapter}
          onAdd={addChapter}
        />
      </div>
    </DndProvider>
  );
}
