'use client';

import { createContext, useCallback, useContext, useRef } from 'react';

interface ChapterExpandContextValue {
  register: (chapterId: string, expandFn: () => void) => () => void;
  expandAndScrollToFile: (chapterId: string, fileId: string) => void;
}

const ChapterExpandContext = createContext<ChapterExpandContextValue | null>(null);

export function ChapterExpandProvider({ children }: { children: React.ReactNode }) {
  const registryRef = useRef<Map<string, () => void>>(new Map());

  const register = useCallback((chapterId: string, expandFn: () => void) => {
    registryRef.current.set(chapterId, expandFn);
    return () => {
      registryRef.current.delete(chapterId);
    };
  }, []);

  const expandAndScrollToFile = useCallback((chapterId: string, fileId: string) => {
    const expandFn = registryRef.current.get(chapterId);
    if (expandFn) expandFn();

    // Wait for the expand animation to render, then scroll
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(`file-${fileId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    });
  }, []);

  return (
    <ChapterExpandContext.Provider value={{ register, expandAndScrollToFile }}>
      {children}
    </ChapterExpandContext.Provider>
  );
}

export function useChapterExpand() {
  return useContext(ChapterExpandContext);
}
