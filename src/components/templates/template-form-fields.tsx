"use client";

import type { TemplatePrType } from "@/types/template";
import { PR_TYPE_OPTIONS } from "./pr-type-badge";
import { RequireAsterisk } from "../ui";

interface TemplateFormFieldsProps {
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  prType: TemplatePrType | "";
  onPrTypeChange: (value: TemplatePrType | "") => void;
}

export function TemplateFormFields({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  prType,
  onPrTypeChange,
}: TemplateFormFieldsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-6 py-5 mb-6 space-y-5">
      <div>
        <label className="block text-xs font-semibold tracking-wider text-gray-500 mb-1.5">
          Template name <RequireAsterisk />
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
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
          onChange={(e) => onDescriptionChange(e.target.value)}
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
              onPrTypeChange(e.target.value as TemplatePrType | "")
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
  );
}
