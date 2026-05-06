"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useCurrentUser } from "@/hooks/use-auth";
import {
  useWalkthroughComments,
  useCreateWalkthroughComment,
} from "@/hooks/use-walkthrough";
import { formatRelativeTime } from "@/utils/date-diff";

interface CommentSectionProps {
  walkthroughId: string;
}

export function CommentSection({ walkthroughId }: CommentSectionProps) {
  const user = useCurrentUser();
  const [content, setContent] = useState("");

  const { data } = useWalkthroughComments(walkthroughId);

  const comments = (data?.data?.items ?? []).filter((c) => !c.chapterId && !c.walkthroughFileId && !c.parentId);

  const addComment = useCreateWalkthroughComment(walkthroughId);

  const handleSubmit = () => {
    if (!content.trim()) return;
    addComment.mutate({ content }, { onSuccess: () => setContent("") });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
        <MessageSquare className="w-4 h-4 text-gray-400" />
        <h3 className="font-semibold text-gray-900">General Discussion</h3>
        <span className="text-sm text-gray-400">{comments.length}</span>
      </div>

      {/* Comment input */}
      <div className="flex items-start gap-3 px-6 py-4 border-b border-gray-100">
        <UserAvatar src={user?.avatarUrl} displayName={user?.displayName} username={user?.username} size="sm" className="mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <textarea
            rows={1}
            className="flex-1 min-w-0 bg-transparent text-sm text-gray-500 placeholder:text-gray-300 resize-none outline-none"
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || addComment.isPending}
            className="p-1.5 rounded-md bg-violet-100 text-violet-600 hover:bg-violet-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Comments list */}
      {comments.length > 0 && (
        <div className="divide-y divide-gray-100">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 px-6 py-3.5">
              <UserAvatar
                src={comment.avatarUrl}
                displayName={comment.username}
                username={comment.username}
                size="sm"
                className="shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">{comment.username}</span>
                  <span className="text-xs text-gray-400">{formatRelativeTime(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed break-words">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
