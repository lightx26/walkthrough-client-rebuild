'use client';

import { useState } from 'react';

import { Send } from 'lucide-react';

import { UserAvatar } from '@/components/ui';
import { Button } from '@/components/ui/button';

import { useCurrentUser } from '@/hooks/use-auth';
import { useCreateFileComment } from '@/hooks/use-walkthrough';

interface AddCommentRowProps {
  walkthroughId: string;
  fileId: string;
  diffPosition: number;
  onClose: () => void;
}

export function AddCommentRow({
  walkthroughId,
  fileId,
  diffPosition,
  onClose,
}: AddCommentRowProps) {
  const user = useCurrentUser();
  const [text, setText] = useState('');

  const addComment = useCreateFileComment(walkthroughId, fileId);

  return (
    <tr>
      <td colSpan={3} className="px-0 py-0">
        <div className="flex max-w-200 items-center gap-2 border-l-4 border-violet-400 bg-violet-50 px-4 py-2.5">
          <UserAvatar
            src={user?.avatarUrl}
            displayName={user?.displayName}
            username={user?.username}
            size="sm"
            className="shrink-0"
          />
          <input
            autoFocus
            className="min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-500 outline-none placeholder:text-gray-300 focus:border-violet-400"
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'Enter' && !e.shiftKey && text.trim()) {
                e.preventDefault();
                addComment.mutate(
                  { content: text, walkthroughFileId: fileId, diffPosition },
                  {
                    onSuccess: () => {
                      setText('');
                      onClose();
                    },
                  }
                );
              }
            }}
          />
          <Button
            variant="primarySoft"
            size="none"
            onClick={() =>
              text.trim() &&
              addComment.mutate(
                { content: text, walkthroughFileId: fileId, diffPosition },
                {
                  onSuccess: () => {
                    setText('');
                    onClose();
                  },
                }
              )
            }
            disabled={!text.trim() || addComment.isPending}
            className="p-1.5"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
