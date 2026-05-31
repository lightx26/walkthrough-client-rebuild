import type { ReactNode } from 'react';

import { Eye, MessageSquare, PenLine, Waypoints } from 'lucide-react';

import { formatRelativeTime } from '@/utils/date-diff';

interface MockActivity {
  id: string;
  type: 'comment' | 'publish' | 'review' | 'annotate' | 'draft' | 'reply';
  text: string;
  occurredAt: string;
}

const MOCK_ACTIVITIES: MockActivity[] = [
  {
    id: '1',
    type: 'comment',
    text: 'Commented on "CommentsSync walkthrough" · Chapter 5',
    occurredAt: new Date(Date.now() - 14 * 60_000).toISOString(),
  },
  {
    id: '2',
    type: 'publish',
    text: 'Published "Refactor versioning to use snapshots"',
    occurredAt: new Date(Date.now() - 20 * 60_000).toISOString(),
  },
  {
    id: '3',
    type: 'review',
    text: 'Reviewed chapter 4 of "Introduce CommentsSync"',
    occurredAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString(),
  },
  {
    id: '4',
    type: 'annotate',
    text: 'Added 3 annotations to "Elastic search index walkthrough"',
    occurredAt: new Date(Date.now() - 24 * 60 * 60_000).toISOString(),
  },
  {
    id: '5',
    type: 'draft',
    text: 'Created walkthrough draft "Break down PR into chapters"',
    occurredAt: new Date(Date.now() - 2 * 24 * 60 * 60_000).toISOString(),
  },
  {
    id: '6',
    type: 'reply',
    text: 'Replied to Hao Vu in "Chapter reorder drag-drop"',
    occurredAt: new Date(Date.now() - 3 * 24 * 60 * 60_000).toISOString(),
  },
];

const activityIcon: Record<MockActivity['type'], ReactNode> = {
  comment: <MessageSquare className="h-3.5 w-3.5 text-violet-500" />,
  publish: <Waypoints className="h-3.5 w-3.5 text-green-500" />,
  review: <Eye className="h-3.5 w-3.5 text-blue-500" />,
  annotate: <PenLine className="h-3.5 w-3.5 text-orange-400" />,
  draft: <Waypoints className="h-3.5 w-3.5 text-amber-500" />,
  reply: <MessageSquare className="h-3.5 w-3.5 text-gray-400" />,
};

export function RecentActivityPanel() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Recent activity</h2>
        <span className="text-xs text-gray-400">Last 7 days</span>
      </div>

      <div className="space-y-4">
        {MOCK_ACTIVITIES.map((activity) => (
          <div key={activity.id} className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-gray-50">
              {activityIcon[activity.type]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs leading-snug text-gray-700">{activity.text}</p>
              <p className="mt-0.5 text-[11px] text-gray-400">
                {formatRelativeTime(activity.occurredAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
