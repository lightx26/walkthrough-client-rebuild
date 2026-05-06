"use client";

import { useEffect } from "react";
import { X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PrFile } from "@/types/github";
import {
  parsePatch,
  computeDiffStats,
} from "@/components/walkthrough-detail/diff-viewer";
import { useSyntaxHighlight } from "@/hooks/use-syntax-highlight";
import { baseName } from "./file-utils";

function statusLabel(status: PrFile["status"]) {
  switch (status) {
    case "added":
      return { text: "Added", cls: "bg-green-100 text-green-700" };
    case "removed":
      return { text: "Removed", cls: "bg-red-100 text-red-700" };
    case "renamed":
      return { text: "Renamed", cls: "bg-purple-100 text-purple-700" };
    default:
      return { text: "Modified", cls: "bg-amber-100 text-amber-700" };
  }
}

function dirName(filename: string) {
  const slash = filename.lastIndexOf("/");
  return slash === -1 ? "" : filename.slice(0, slash);
}

interface Props {
  file: PrFile;
  onClose: () => void;
}

export function DiffFileModal({ file, onClose }: Props) {
  const badge = statusLabel(file.status);
  const stats = file.patch ? computeDiffStats(file.patch) : null;
  const lines = file.patch ? parsePatch(file.patch) : [];
  const dir = dirName(file.filename);
  const { tokens } = useSyntaxHighlight(file.patch, file.filename);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-orange-500" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-semibold text-gray-900">
                {baseName(file.filename)}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  badge.cls,
                )}
              >
                {badge.text}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-sm text-gray-400">
              {dir && <span className="font-mono">{dir}</span>}
              {stats && (
                <>
                  {dir && <span className="text-gray-300">·</span>}
                  <span className="font-mono text-green-600">
                    +{stats.added}
                  </span>
                  <span className="font-mono text-red-500">
                    -{stats.removed}
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diff content */}
        <div className="overflow-auto flex-1">
          {lines.length === 0 ? (
            <p className="p-6 text-sm text-gray-400 text-center">
              No diff available.
            </p>
          ) : (
            <table className="w-full text-xs font-mono border-collapse table-fixed">
              <tbody>
                {lines.map((line, i) => {
                  if (line.type === "hunk") {
                    return (
                      <tr key={i} className="bg-blue-50">
                        <td className="w-10 px-2 py-0.5 text-right text-blue-400 select-none border-r border-blue-100" />
                        <td className="w-10 px-2 py-0.5 text-right text-blue-400 select-none border-r border-blue-100" />
                        <td className="px-3 py-0.5 text-blue-500">
                          {line.content}
                        </td>
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
                    <tr key={i} className={rowBg}>
                      <td className="w-10 px-2 py-0.5 text-right text-gray-400 select-none border-r border-gray-100 min-w-10">
                        {line.oldNo ?? ""}
                      </td>
                      <td className="w-10 px-2 py-0.5 text-right text-gray-400 select-none border-r border-gray-100 min-w-10">
                        {line.newNo ?? ""}
                      </td>
                      <td className={cn("px-3 py-0.5 whitespace-pre", textCls)}>
                        <span className="select-none mr-1 text-gray-400">
                          {line.type === "add"
                            ? "+"
                            : line.type === "del"
                              ? "-"
                              : " "}
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
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
