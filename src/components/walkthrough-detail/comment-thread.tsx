"use client";

import React, { useState } from "react";
import { Send, CornerDownLeft } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useCurrentUser } from "@/hooks/use-auth";
import { useCreateFileComment } from "@/hooks/use-walkthrough";
import { formatRelativeTime } from "@/utils/date-diff";
import type { WalkthroughComment } from "@/types/walkthrough";
import { SyncStatusIcon } from "./sync-status-icon";

interface CommentThreadProps {
  comments: WalkthroughComment[];
  walkthroughId: string;
  fileId: string;
  diffPosition: number;
}

export function CommentThread({ comments, walkthroughId, fileId, diffPosition }: CommentThreadProps) {
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
                  <span className="text-[10px] font-semibold text-gray-900">{c.username}</span>
                  <span className="text-[10px] text-gray-400">{formatRelativeTime(c.createdAt)}</span>
                  <SyncStatusIcon status={c.syncStatus} />
                </div>
                <p className="text-xs text-gray-700 ml-8 leading-relaxed wrap-break-word whitespace-pre-wrap">{c.content}</p>
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
                          <span className="text-[10px] font-semibold text-gray-900">{r.username}</span>
                          <span className="text-[10px] text-gray-400">{formatRelativeTime(r.createdAt)}</span>
                        </div>
                        <p className="text-xs text-gray-700 ml-8 leading-relaxed wrap-break-word whitespace-pre-wrap">{r.content}</p>
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
