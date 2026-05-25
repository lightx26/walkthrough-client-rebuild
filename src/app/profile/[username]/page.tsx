"use client";

import { use, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import {
  OverviewTab,
  ProfileHeader,
  RepositoriesTab,
  WalkthroughsTab,
} from "@/components/profile";
import type { ProfileTab } from "@/components/profile";
import {
  useProfile,
  useProfileReviewing,
  useProfileStats,
  useUserWalkthroughs,
} from "@/hooks/use-profile";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  const { data: profile, isLoading: profileLoading } = useProfile(username);
  const { data: stats } = useProfileStats(username);
  const { data: walkthroughs, isLoading: walkthroughsLoading } =
    useUserWalkthroughs(username);
  const { data: reviewing, isLoading: reviewingLoading } =
    useProfileReviewing(username);

  if (profileLoading || !profile) {
    return (
      <DashboardLayout>
        <div className="w-full animate-pulse">
          <div className="h-24 bg-gray-200" />
          <div className="px-8 pt-4 space-y-3">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-64 bg-gray-100 rounded" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full min-h-full bg-gray-50 overflow-auto">
        <ProfileHeader
          profile={profile}
          stats={stats}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="px-8 py-6">
          {activeTab === "overview" && (
            <OverviewTab
              walkthroughs={walkthroughs}
              walkthroughsLoading={walkthroughsLoading}
              totalWalkthroughs={stats?.walkthroughs}
              reviewing={reviewing}
              reviewingLoading={reviewingLoading}
              onViewAllWalkthroughs={() => setActiveTab("walkthroughs")}
            />
          )}
          {activeTab === "walkthroughs" && (
            <WalkthroughsTab
              allWalkthroughs={walkthroughs}
              isLoading={walkthroughsLoading}
            />
          )}
          {activeTab === "repositories" && (
            <RepositoriesTab username={username} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
