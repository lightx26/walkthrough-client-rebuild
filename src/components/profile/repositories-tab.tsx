"use client";

import { useState } from "react";
import { RepositoriesPanel } from "./repositories-panel";
import { RecentPrsPanel } from "./recent-prs-panel";
import { useRepositories } from "@/hooks/use-github";
import { useRecentPullRequests } from "@/hooks/use-profile";

const PER_PAGE = 6;

interface RepositoriesTabProps {
  username: string;
}

export function RepositoriesTab({ username }: RepositoriesTabProps) {
  const [page, setPage] = useState(1);
  const { data: reposData, isLoading: reposLoading } = useRepositories({
    page,
    perPage: PER_PAGE,
    type: "owner",
  });
  const { data: prs, isLoading: prsLoading } = useRecentPullRequests(6);

  const repositories = reposData?.data?.items ?? [];
  const totalPages = reposData?.data?.totalPages ?? 1;
  const totalElements = reposData?.data?.totalElements ?? 0;

  // Client-side filter: only repos owned by this user
  const userRepos = repositories.filter(
    (r) => r.owner.login.toLowerCase() === username.toLowerCase(),
  );

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <RepositoriesPanel
          repositories={userRepos}
          total={totalElements}
          isLoading={reposLoading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
      <div className="w-96 xl:w-xl shrink-0">
        <RecentPrsPanel pullRequests={prs} isLoading={prsLoading} />
      </div>
    </div>
  );
}
