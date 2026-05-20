"use client";

import { useState } from "react";
import { BarChart2, BookOpen, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AuthorView } from "@/components/analytics/author-view";
import { TeamLeadView } from "@/components/analytics/team-lead-view";
import { AnalyticsTabButton } from "@/components/analytics/analytics-tab-button";

type Tab = "author" | "team";

export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>("author");

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto px-8 py-7 min-w-0">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-violet-600" />
          </div>
          <h1 className="text-[22px] font-bold text-gray-900">Analytics</h1>
        </div>

        <div className="inline-flex items-center p-1 mb-6">
          <AnalyticsTabButton
            active={tab === "author"}
            onClick={() => setTab("author")}
            icon={<BookOpen className="w-3.5 h-3.5" />}
            label="Author view"
          />
          <AnalyticsTabButton
            active={tab === "team"}
            onClick={() => setTab("team")}
            icon={<Users className="w-3.5 h-3.5" />}
            label="Team lead view"
          />
        </div>

        {tab === "author" ? <AuthorView /> : <TeamLeadView />}
      </main>
    </DashboardLayout>
  );
}
