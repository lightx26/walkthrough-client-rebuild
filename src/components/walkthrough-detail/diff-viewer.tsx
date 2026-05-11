"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { WalkthroughComment } from "@/types/walkthrough";
import { useSyntaxHighlight } from "@/hooks/use-syntax-highlight";
import { parsePatch } from "./diff-utils";
import { CommentThread } from "./comment-thread";
import { AddCommentRow } from "./add-comment-row";

export { parsePatch, computeDiffStats } from "./diff-utils";
export type { DiffLineType, DiffLine } from "./diff-utils";

// ── Main DiffViewer ──────────────────────────────────────────────────────────

interface DiffViewerProps {
  rawPatch: string;
  walkthroughId: string;
  fileId: string;
  filename: string;
  comments?: WalkthroughComment[];
}

export function DiffViewer({ rawPatch, walkthroughId, fileId, filename, comments = [] }: DiffViewerProps) {
  const [activeLineIdx, setActiveLineIdx] = useState<number | null>(null);
  const { tokens } = useSyntaxHighlight(rawPatch, filename);

  const lines = parsePatch(rawPatch);

  const commentsByPosition = new Map<number, WalkthroughComment[]>();
  for (const c of comments) {
    if (c.diffPosition !== null) {
      const pos = c.diffPosition;
      if (!commentsByPosition.has(pos)) commentsByPosition.set(pos, []);
      commentsByPosition.get(pos)!.push(c);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px] font-mono border-collapse table-fixed">
        <tbody>
          {lines.map((line, i) => {
            const lineComments = commentsByPosition.get(i) ?? [];
            const isAddingComment = activeLineIdx === i;

            if (line.type === "hunk") {
              return (
                <tr key={i} className="bg-blue-50">
                  <td className="w-10 px-2 py-0.5 text-right text-gray-400 select-none border-r border-gray-200" />
                  <td className="w-10 px-2 py-0.5 text-right text-gray-400 select-none border-r border-gray-200" />
                  <td className="px-3 py-0.5 text-blue-500">{line.content}</td>
                </tr>
              );
            }

            const rowBg = cn(
              line.type === "add" && "bg-green-50",
              line.type === "del" && "bg-red-50",
              line.type === "ctx" && "bg-white",
            );
            const lineTokens = tokens?.get(i);
            const textCls = lineTokens
              ? undefined
              : cn(
                  line.type === "add" && "text-green-700",
                  line.type === "del" && "text-red-700",
                  line.type === "ctx" && "text-gray-800",
                );

            return (
              <React.Fragment key={i}>
                <tr
                  className={cn(rowBg, "group cursor-pointer hover:brightness-95 transition-[filter]")}
                  onClick={() => setActiveLineIdx(isAddingComment ? null : i)}
                >
                  <td className="w-10 px-2 py-0.5 text-right text-gray-400 select-none border-r border-gray-100 min-w-10">
                    {line.oldNo ?? ""}
                  </td>
                  <td className="w-10 px-2 py-0.5 text-right text-gray-400 select-none border-r border-gray-100 min-w-10">
                    {line.newNo ?? ""}
                  </td>
                  <td className={cn("px-3 py-0.5 whitespace-pre", textCls)}>
                    <span className="select-none mr-1 text-gray-400">
                      {line.type === "add" ? "+" : line.type === "del" ? "-" : " "}
                    </span>
                    {lineTokens
                      ? lineTokens.map((token, j) => (
                          <span key={j} style={{ color: token.color }}>
                            {token.content}
                          </span>
                        ))
                      : line.content}
                  </td>
                </tr>

                {/* Inline comment threads */}
                {lineComments.length > 0 && (
                  <CommentThread
                    comments={lineComments}
                    walkthroughId={walkthroughId}
                    fileId={fileId}
                    diffPosition={i}
                  />
                )}

                {/* Add comment input */}
                {isAddingComment && (
                  <AddCommentRow
                    walkthroughId={walkthroughId}
                    fileId={fileId}
                    diffPosition={i}
                    onClose={() => setActiveLineIdx(null)}
                  />
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
