export type TemplatePrType = 'FEATURE' | 'REFACTOR' | 'HOTFIX' | 'BUGFIX' | 'MIGRATION' | 'OTHER';

export interface TemplateChapter {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  prType: TemplatePrType | null;
  isBuiltin: boolean;
  duplicateCount: number;
  chapters: TemplateChapter[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateSummary {
  id: string;
  name: string;
  description: string | null;
  prType: TemplatePrType | null;
  isBuiltin: boolean;
  duplicateCount: number;
  chapterCount: number;
  updatedAt: string;
}

export interface TemplateChapterRequest {
  title: string;
  description?: string | null;
  sortOrder: number;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string | null;
  prType?: TemplatePrType | null;
  chapters: TemplateChapterRequest[];
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string | null;
  prType?: TemplatePrType | null;
  chapters?: TemplateChapterRequest[];
}

export interface DuplicateTemplateRequest {
  name?: string;
}
