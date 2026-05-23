"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { usePullRequestFiles } from "@/hooks/use-github";
import { useCreateWalkthrough } from "@/hooks/use-walkthrough";
import {
  WalkthroughEditor,
  type WalkthroughFormData,
} from "@/components/create-walkthrough";
import type { CreateWalkthroughRequest } from "@/types/walkthrough";

function CreateWalkthroughContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const owner = searchParams.get("owner") ?? "";
  const repo = searchParams.get("repo") ?? "";
  const prNumber = Number(searchParams.get("prNumber"));

  const { data: filesData, isLoading: filesLoading } = usePullRequestFiles({
    owner,
    repo,
    prNumber,
  });

  const allFiles = filesData?.data?.items ?? [];
  const createWalkthrough = useCreateWalkthrough();

  const handleSave = (data: WalkthroughFormData, status: "DRAFT" | "PUBLISHED") => {
    const request: CreateWalkthroughRequest = {
      owner,
      repo,
      prNumber,
      title: data.title,
      description: data.description,
      status,
      chapters: data.chapters,
    };

    createWalkthrough.mutate(request, {
      onSuccess: (resp) => {
        router.push(`/walkthroughs/${resp.data.id}`);
      },
    });
  };

  return (
    <WalkthroughEditor
      headerTitle="New walkthrough"
      repo={repo}
      prNumber={prNumber}
      allFiles={allFiles}
      filesLoading={filesLoading}
      onSave={handleSave}
      isSaving={createWalkthrough.isPending}
      requireAllFilesAssigned
    />
  );
}

export default function CreateWalkthroughPage() {
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <CreateWalkthroughContent />
      </Suspense>
    </DashboardLayout>
  );
}
