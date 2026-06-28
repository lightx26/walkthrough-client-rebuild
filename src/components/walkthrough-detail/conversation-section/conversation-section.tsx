'use client';

import { useState } from 'react';

import { CheckCircle2, MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';

import { UserAvatar } from '@/components/ui';
import { Button } from '@/components/ui/button';

import { useCurrentUser } from '@/hooks/use-auth';
import {
  useCreateWalkthroughComment,
  useDeleteComment,
  useMyReviewDecision,
  useReviewDecisions,
  useSubmitReviewDecision,
  useWalkthroughComments,
  useWithdrawReviewDecision,
} from '@/hooks/use-walkthrough';

import type { ReviewDecision, ReviewDecisionType, WalkthroughComment } from '@/types/walkthrough';

import { CommentCard } from './comment-card';
import { DecisionRow } from './decision-row';
import { ReviewOption } from './review-option';
import { TabButton } from './tab-button';

interface ConversationSectionProps {
  walkthroughId: string;
  /** User id of the walkthrough creator — used to badge their comments as "Author". */
  authorUserId: string;
  /** Whether the current viewer can submit an approve/reject review. */
  canReview: boolean;
}

type TimelineItem =
  | { kind: 'comment'; at: string; comment: WalkthroughComment }
  | { kind: 'decision'; at: string; decision: ReviewDecision };

export function ConversationSection({ walkthroughId, authorUserId, canReview }: ConversationSectionProps) {
  const user = useCurrentUser();

  const { data: commentsData } = useWalkthroughComments(walkthroughId);
  const { data: decisionsData } = useReviewDecisions(walkthroughId);
  const { data: myDecisionData } = useMyReviewDecision(walkthroughId);

  const addComment = useCreateWalkthroughComment(walkthroughId);
  const deleteComment = useDeleteComment(walkthroughId);
  const submitDecision = useSubmitReviewDecision(walkthroughId);
  const withdrawDecision = useWithdrawReviewDecision(walkthroughId);

  const comments = (commentsData?.data?.items ?? []).filter(
    (c) => !c.chapterId && !c.walkthroughFileId && !c.parentId
  );
  const decisions = decisionsData?.data?.items ?? [];
  const myDecision = myDecisionData?.data ?? null;

  // Merge comments + review decisions into a single chronological timeline.
  const timeline: TimelineItem[] = [
    ...comments.map<TimelineItem>((c) => ({ kind: 'comment', at: c.createdAt, comment: c })),
    ...decisions.map<TimelineItem>((d) => ({ kind: 'decision', at: d.updatedAt, decision: d })),
  ].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  // Aggregate review status badge (GitHub-style).
  const hasRejected = decisions.some((d) => d.decision === 'REJECTED');
  const hasApproved = decisions.some((d) => d.decision === 'APPROVED');
  const status: 'CHANGES_REQUESTED' | 'APPROVED' | null = hasRejected
    ? 'CHANGES_REQUESTED'
    : hasApproved
      ? 'APPROVED'
      : null;

  // ── Composer state ──
  const [tab, setTab] = useState<'comment' | 'review'>('comment');
  const [commentText, setCommentText] = useState('');
  const [reviewSummary, setReviewSummary] = useState('');
  // Derive the active choice during render: the user's explicit pick wins,
  // otherwise fall back to their existing decision, otherwise default to approve.
  const [reviewChoiceOverride, setReviewChoiceOverride] = useState<ReviewDecisionType | null>(null);
  const reviewChoice: ReviewDecisionType = reviewChoiceOverride ?? myDecision?.decision ?? 'APPROVED';

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    addComment.mutate({ content: commentText.trim() }, { onSuccess: () => setCommentText('') });
  };

  const handleSubmitReview = () => {
    submitDecision.mutate(
      { decision: reviewChoice, comment: reviewSummary.trim() || undefined },
      { onSuccess: () => setReviewSummary('') }
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
        <MessageSquare className="h-4 w-4 text-gray-400" />
        <h3 className="font-semibold text-gray-900">Conversation</h3>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
          {timeline.length}
        </span>
        {status && (
          <span className="ml-auto">
            {status === 'APPROVED' ? (
              <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-green-700">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                APPROVED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                CHANGES REQUESTED
              </span>
            )}
          </span>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-3 px-6 py-5">
        {timeline.length === 0 ? (
          <p className="text-sm text-gray-400">No activity yet. Start the conversation below.</p>
        ) : (
          timeline.map((item) =>
            item.kind === 'comment' ? (
              <CommentCard
                key={`c-${item.comment.id}`}
                comment={item.comment}
                isAuthor={item.comment.userId === authorUserId}
                canDelete={user?.id === item.comment.userId}
                onDelete={() => deleteComment.mutate(item.comment.id)}
                deleting={deleteComment.isPending}
              />
            ) : (
              <DecisionRow key={`d-${item.decision.id}`} decision={item.decision} />
            )
          )
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-gray-100 px-6 py-5">
        <div className="flex items-start gap-3">
          <UserAvatar
            src={user?.avatarUrl}
            displayName={user?.displayName}
            username={user?.username}
            size="md"
            className="mt-0.5 shrink-0"
          />
          <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-gray-200">
            {/* Tab bar */}
            <div className="flex items-center gap-1 border-b border-gray-100 bg-gray-50/60 px-2">
              <TabButton
                active={tab === 'comment'}
                onClick={() => setTab('comment')}
                icon={<MessageSquare className="h-3.5 w-3.5" />}
                label="Comment"
              />
              {canReview && (
                <TabButton
                  active={tab === 'review'}
                  onClick={() => setTab('review')}
                  icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                  label="Review"
                />
              )}
            </div>

            {tab === 'comment' || !canReview ? (
              <div>
                <textarea
                  rows={3}
                  className="w-full resize-none bg-transparent px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-300"
                  placeholder="Leave a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                  maxLength={1000}
                />
                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5">
                  <span />
                  <Button
                    variant="primary"
                    size="sm"
                    className="gap-1.5 rounded-lg"
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim() || addComment.isPending}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Comment
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <textarea
                  rows={3}
                  className="w-full resize-none bg-transparent px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-300"
                  placeholder="Leave a review summary (optional)..."
                  value={reviewSummary}
                  onChange={(e) => setReviewSummary(e.target.value)}
                  maxLength={1000}
                />
                <div className="flex gap-2 border-t border-gray-100 px-4 py-3">
                  <ReviewOption
                    selected={reviewChoice === 'APPROVED'}
                    onSelect={() => setReviewChoiceOverride('APPROVED')}
                    tone="approve"
                    icon={<ThumbsUp className="h-4 w-4" />}
                    title="Approve"
                    description="Submit feedback and approve merging."
                  />
                  <ReviewOption
                    selected={reviewChoice === 'REJECTED'}
                    onSelect={() => setReviewChoiceOverride('REJECTED')}
                    tone="reject"
                    icon={<ThumbsDown className="h-4 w-4" />}
                    title="Request changes"
                    description="Issues must be addressed before merging."
                  />
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5">
                  {myDecision ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg text-gray-500"
                      onClick={() => withdrawDecision.mutate()}
                      disabled={withdrawDecision.isPending}
                    >
                      Withdraw review
                    </Button>
                  ) : (
                    <span />
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-lg"
                    onClick={handleSubmitReview}
                    disabled={submitDecision.isPending}
                  >
                    {myDecision ? 'Update review' : 'Submit review'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
