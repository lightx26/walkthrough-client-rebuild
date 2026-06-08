'use client';

import type { TemplatePrType } from '@/types/template';

import { RequireAsterisk } from '../ui';
import { PR_TYPE_OPTIONS } from './pr-type-badge';

interface TemplateFormFieldsProps {
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  prType: TemplatePrType | '';
  onPrTypeChange: (value: TemplatePrType | '') => void;
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
    <div className="mb-6 space-y-5 rounded-xl border border-gray-200 bg-white px-6 py-5">
      <div>
        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500">
          Template name <RequireAsterisk />
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Full-stack feature with frontend"
          maxLength={100}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="What kind of PR is this template designed for? When should an author use it?"
          rows={3}
          maxLength={1000}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-500">
          PR type
        </label>
        <div className="relative">
          <select
            value={prType}
            onChange={(e) => onPrTypeChange(e.target.value as TemplatePrType | '')}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-400 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
          >
            <option value="">— No type —</option>
            {PR_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {prType && (
            <div className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center gap-2 bg-white pr-2 pl-0">
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
