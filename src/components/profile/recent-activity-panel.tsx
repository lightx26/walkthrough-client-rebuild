import type { ReactNode } from "react";
import { BookOpen, Eye, MessageSquare, PenLine } from "lucide-react";
import { formatRelativeTime } from "@/utils/date-diff";

interface MockActivity {
  id: string;
  type: "comment" | "publish" | "review" | "annotate" | "draft" | "reply";
  text: string;
  occurredAt: string;
}

const MOCK_ACTIVITIES: MockActivity[] = [
  {
    id: "1",
    type: "comment",
    text: 'Commented on "CommentsSync walkthrough" · Chapter 5',
    occurredAt: new Date(Date.now() - 14 * 60_000).toISOString(),
  },
  {
    id: "2",
    type: "publish",
    text: 'Published "Refactor versioning to use snapshots"',
    occurredAt: new Date(Date.now() - 20 * 60_000).toISOString(),
  },
  {
    id: "3",
    type: "review",
    text: 'Reviewed chapter 4 of "Introduce CommentsSync"',
    occurredAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString(),
  },
  {
    id: "4",
    type: "annotate",
    text: 'Added 3 annotations to "Elastic search index walkthrough"',
    occurredAt: new Date(Date.now() - 24 * 60 * 60_000).toISOString(),
  },
  {
    id: "5",
    type: "draft",
    text: 'Created walkthrough draft "Break down PR into chapters"',
    occurredAt: new Date(Date.now() - 2 * 24 * 60 * 60_000).toISOString(),
  },
  {
    id: "6",
    type: "reply",
    text: 'Replied to Hao Vu in "Chapter reorder drag-drop"',
    occurredAt: new Date(Date.now() - 3 * 24 * 60 * 60_000).toISOString(),
  },
];

const activityIcon: Record<MockActivity["type"], ReactNode> = {
  comment: <MessageSquare className="w-3.5 h-3.5 text-violet-500" />,
  publish: <BookOpen className="w-3.5 h-3.5 text-green-500" />,
  review: <Eye className="w-3.5 h-3.5 text-blue-500" />,
  annotate: <PenLine className="w-3.5 h-3.5 text-orange-400" />,
  draft: <BookOpen className="w-3.5 h-3.5 text-amber-500" />,
  reply: <MessageSquare className="w-3.5 h-3.5 text-gray-400" />,
};

export function RecentActivityPanel() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900">Recent activity</h2>
        <span className="text-xs text-gray-400">Last 7 days</span>
      </div>

      <div className="space-y-4">
        {MOCK_ACTIVITIES.map((activity) => (
          <div key={activity.id} className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
              {activityIcon[activity.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 leading-snug">
                {activity.text}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {formatRelativeTime(activity.occurredAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
