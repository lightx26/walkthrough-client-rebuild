export interface ChapterDraft {
  key: string;
  title: string;
  description: string;
}

let chapterKeySeq = 0;
export const newChapterKey = () => `c-${++chapterKeySeq}-${Date.now()}`;
