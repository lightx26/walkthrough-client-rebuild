"use client";

import React, { useState } from "react";
import { Send, CornerDownLeft, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WalkthroughComment } from "@/types/walkthrough";
import { useCreateFileComment } from "@/hooks/use-walkthrough";
import { useCurrentUser } from "@/hooks/use-auth";
import { UserAvatar } from "@/components/ui/user-avatar";
import { formatRelativeTime } from "@/utils/date-diff";

type DiffLineType = "hunk" | "add" | "del" | "ctx";

interface DiffLine {
  type: DiffLineType;
  content: string;
  oldNo?: number;
  newNo?: number;
}

function parsePatch(rawPatch: string): DiffLine[] {
  const lines = rawPatch.split("\n");
  const result: DiffLine[] = [];
  let oldLine = 0;
  let newLine = 0;
  for (const line of lines) {
    if (line.startsWith("@@")) {
      const match = line.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      if (match) {
        oldLine = parseInt(match[1], 10);
        newLine = parseInt(match[2], 10);
      }
      result.push({ type: "hunk", content: line });
    } else if (line.startsWith("+")) {
      result.push({ type: "add", content: line.slice(1), newNo: newLine++ });
    } else if (line.startsWith("-")) {
      result.push({ type: "del", content: line.slice(1), oldNo: oldLine++ });
    } else if (line.startsWith(" ") || line === "") {
      result.push({ type: "ctx", content: line.slice(1), oldNo: oldLine++, newNo: newLine++ });
    }
  }
  return result;
}

export function computeDiffStats(rawPatch: string): { added: number; removed: number } {
  let added = 0;
  let removed = 0;
  for (const line of rawPatch.split("\n")) {
    if (line.startsWith("+") && !line.startsWith("+++")) added++;
    else if (line.startsWith("-") && !line.startsWith("---")) removed++;
  }
  return { added, removed };
}

// ── Sync status icon ─────────────────────────────────────────────────────────

function SyncStatusIcon({ status }: { status: string }) {
  switch (status) {
    case "synced":
      return <span title="Synced to GitHub"><CheckCircle2 className="w-3 h-3 text-green-500" /></span>;
    case "pending":
      return <span title="Not synced"><Circle className="w-3 h-3 text-gray-400" /></span>;
    case "failed":
      return <span title="Sync failed"><AlertCircle className="w-3 h-3 text-red-500" /></span>;
    default:
      return <span title="Not synced"><Circle className="w-3 h-3 text-gray-300" /></span>;
  }
}

// ── Inline comment thread ────────────────────────────────────────────────────

interface CommentThreadProps {
  comments: WalkthroughComment[];
  walkthroughId: string;
  fileId: string;
  diffPosition: number;
}

function CommentThread({ comments, walkthroughId, fileId, diffPosition }: CommentThreadProps) {
  const user = useCurrentUser();
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const addReply = useCreateFileComment(walkthroughId, fileId);

  return (
    <>
      {comments.map((c) => (
        <React.Fragment key={c.id}>
          <tr>
            <td colSpan={3} className="px-0 py-0">
              <div className="border-l-4 border-violet-400 bg-white px-4 py-3 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <UserAvatar
                    src={c.avatarUrl}
                    displayName={c.username}
                    username={c.username}
                    size="sm"
                  />
                  <span className="text-xs font-semibold text-gray-900">{c.username}</span>
                  <span className="text-xs text-gray-400">{formatRelativeTime(c.createdAt)}</span>
                  <SyncStatusIcon status={c.syncStatus} />
                </div>
                <p className="text-sm text-gray-700 ml-8 leading-relaxed wrap-break-word whitespace-pre-wrap">{c.content}</p>
                <button
                  onClick={() => setReplyTargetId(replyTargetId === c.id ? null : c.id)}
                  className="ml-8 mt-1 flex items-center gap-1 text-xs text-gray-400 hover:text-violet-600 transition-colors"
                >
                  <CornerDownLeft className="w-3 h-3" />
                  Reply
                </button>
                {/* Replies */}
                {c.replies.length > 0 && (
                  <div className="ml-8 mt-2 space-y-2 pl-3 border-l border-gray-200">
                    {c.replies.map((r) => (
                      <div key={r.id}>
                        <div className="flex items-center gap-2 mb-0.5">
                          <UserAvatar src={r.avatarUrl} displayName={r.username} username={r.username} size="sm" />
                          <span className="text-xs font-semibold text-gray-900">{r.username}</span>
                          <span className="text-xs text-gray-400">{formatRelativeTime(r.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-700 ml-8 leading-relaxed wrap-break-word whitespace-pre-wrap">{r.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </td>
          </tr>
          {/* Reply input */}
          {replyTargetId === c.id && (
            <tr>
              <td colSpan={3} className="px-0 py-0">
                <div className="border-l-4 border-violet-200 bg-violet-50 px-4 py-2.5 flex items-center gap-2">
                  <UserAvatar src={user?.avatarUrl} displayName={user?.displayName} username={user?.username} size="sm" className="shrink-0" />
                  <input
                    autoFocus
                    className="flex-1 min-w-0 bg-white border border-gray-200 rounded-md px-2.5 py-1.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-violet-400"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && replyText.trim()) {
                        e.preventDefault();
                        addReply.mutate(
                          { content: replyText, walkthroughFileId: fileId, diffPosition, parentId: c.id },
                          { onSuccess: () => { setReplyText(""); setReplyTargetId(null); } },
                        );
                      }
                    }}
                  />
                  <button
                    onClick={() => replyText.trim() && addReply.mutate(
                      { content: replyText, walkthroughFileId: fileId, diffPosition, parentId: c.id },
                      { onSuccess: () => { setReplyText(""); setReplyTargetId(null); } },
                    )}
                    disabled={!replyText.trim() || addReply.isPending}
                    className="p-1.5 rounded-md bg-violet-100 text-violet-600 hover:bg-violet-200 disabled:opacity-40 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </>
  );
}

// ── Add-comment input row ────────────────────────────────────────────────────

interface AddCommentRowProps {
  walkthroughId: string;
  fileId: string;
  diffPosition: number;
  onClose: () => void;
}

function AddCommentRow({ walkthroughId, fileId, diffPosition, onClose }: AddCommentRowProps) {
  const user = useCurrentUser();
  const [text, setText] = useState("");

  const addComment = useCreateFileComment(walkthroughId, fileId);

  return (
    <tr>
      <td colSpan={3} className="px-0 py-0">
        <div className="border-l-4 border-violet-400 bg-violet-50 px-4 py-2.5 flex items-center gap-2 max-w-200">
          <UserAvatar src={user?.avatarUrl} displayName={user?.displayName} username={user?.username} size="sm" className="shrink-0" />
          <input
            autoFocus
            className="flex-1 min-w-0 bg-white border border-gray-200 rounded-md px-2.5 py-1.5 text-sm text-gray-500 placeholder:text-gray-300 outline-none focus:border-violet-400"
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter" && !e.shiftKey && text.trim()) {
                e.preventDefault();
                addComment.mutate(
                  { content: text, walkthroughFileId: fileId, diffPosition },
                  { onSuccess: () => { setText(""); onClose(); } },
                );
              }
            }}
          />
          <button
            onClick={() => text.trim() && addComment.mutate(
              { content: text, walkthroughFileId: fileId, diffPosition },
              { onSuccess: () => { setText(""); onClose(); } },
            )}
            disabled={!text.trim() || addComment.isPending}
            className="p-1.5 rounded-md bg-violet-100 text-violet-600 hover:bg-violet-200 disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main DiffViewer ──────────────────────────────────────────────────────────

interface DiffViewerProps {
  rawPatch: string;
  walkthroughId: string;
  fileId: string;
  comments?: WalkthroughComment[];
}

export function DiffViewer({ rawPatch, walkthroughId, fileId, comments = [] }: DiffViewerProps) {
  const [activeLineIdx, setActiveLineIdx] = useState<number | null>(null);

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
      <table className="w-full text-xs font-mono border-collapse table-fixed">
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
            const textCls = cn(
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
                    {line.content}
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
