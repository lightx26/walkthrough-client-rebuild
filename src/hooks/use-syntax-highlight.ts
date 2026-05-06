"use client";

import { useState, useEffect, useRef } from "react";
import type { ThemedToken } from "shiki";
import { detectLanguage, highlightDiffBlock } from "@/lib/shiki";

interface SyntaxHighlightResult {
  tokens: Map<number, ThemedToken[]> | null;
  isReady: boolean;
}

export function useSyntaxHighlight(
  rawPatch: string | undefined,
  filename: string,
): SyntaxHighlightResult {
  const [tokens, setTokens] = useState<Map<number, ThemedToken[]> | null>(null);
  const [isReady, setIsReady] = useState(false);
  const revRef = useRef(0);

  useEffect(() => {
    if (!rawPatch) {
      setTokens(null);
      setIsReady(true);
      return;
    }

    const lang = detectLanguage(filename);
    if (!lang) {
      setTokens(null);
      setIsReady(true);
      return;
    }

    const rev = ++revRef.current;
    setIsReady(false);

    highlightDiffBlock(rawPatch, lang)
      .then((result) => {
        if (revRef.current === rev) {
          setTokens(result);
          setIsReady(true);
        }
      })
      .catch(() => {
        if (revRef.current === rev) {
          setTokens(null);
          setIsReady(true);
        }
      });
  }, [rawPatch, filename]);

  return { tokens, isReady };
}
