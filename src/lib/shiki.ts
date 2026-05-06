import type { ThemedToken, BundledLanguage, Highlighter } from "shiki";
import { parsePatch } from "@/components/walkthrough-detail/diff-viewer";

const EXTENSION_TO_LANG: Record<string, string> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  mjs: "javascript",
  cjs: "javascript",
  mts: "typescript",
  cts: "typescript",
  py: "python",
  rs: "rust",
  go: "go",
  java: "java",
  kt: "kotlin",
  swift: "swift",
  rb: "ruby",
  php: "php",
  cs: "csharp",
  cpp: "cpp",
  c: "c",
  h: "c",
  hpp: "cpp",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  toml: "toml",
  xml: "xml",
  html: "html",
  css: "css",
  scss: "scss",
  less: "less",
  sql: "sql",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
  md: "markdown",
  mdx: "mdx",
  graphql: "graphql",
  gql: "graphql",
  vue: "vue",
  svelte: "svelte",
  dockerfile: "dockerfile",
  tf: "hcl",
  gradle: "groovy",
  groovy: "groovy",
};

export function detectLanguage(filename: string): string | null {
  const base = filename.split("/").pop() ?? "";

  if (base.toLowerCase() === "dockerfile") return "dockerfile";

  const ext = base.includes(".") ? base.split(".").pop()?.toLowerCase() : null;
  if (!ext) return null;

  return EXTENSION_TO_LANG[ext] ?? null;
}

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then((mod) =>
      mod.createHighlighter({
        themes: ["github-light", "github-dark"],
        langs: [],
      }),
    );
  }
  return highlighterPromise;
}

export async function highlightDiffBlock(
  rawPatch: string,
  lang: string,
): Promise<Map<number, ThemedToken[]>> {
  const highlighter = await getHighlighter();

  const loaded = highlighter.getLoadedLanguages();
  if (!loaded.includes(lang)) {
    await highlighter.loadLanguage(lang as BundledLanguage);
  }

  const lines = parsePatch(rawPatch);

  const newSideLines: string[] = [];
  const newSideMapping: number[] = [];
  const oldSideLines: string[] = [];
  const oldSideMapping: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.type === "ctx") {
      newSideLines.push(line.content);
      newSideMapping.push(i);
      oldSideLines.push(line.content);
      oldSideMapping.push(i);
    } else if (line.type === "add") {
      newSideLines.push(line.content);
      newSideMapping.push(i);
    } else if (line.type === "del") {
      oldSideLines.push(line.content);
      oldSideMapping.push(i);
    }
  }

  const result = new Map<number, ThemedToken[]>();

  if (newSideLines.length > 0) {
    const newTokens = highlighter.codeToTokens(newSideLines.join("\n"), {
      lang: lang as BundledLanguage,
      theme: "github-light",
    });
    for (let j = 0; j < newTokens.tokens.length; j++) {
      result.set(newSideMapping[j], newTokens.tokens[j]);
    }
  }

  if (oldSideLines.length > 0) {
    const oldTokens = highlighter.codeToTokens(oldSideLines.join("\n"), {
      lang: lang as BundledLanguage,
      theme: "github-light",
    });
    for (let j = 0; j < oldTokens.tokens.length; j++) {
      const diffIdx = oldSideMapping[j];
      if (!result.has(diffIdx)) {
        result.set(diffIdx, oldTokens.tokens[j]);
      }
    }
  }

  return result;
}
