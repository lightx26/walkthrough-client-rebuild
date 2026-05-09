"use client";

import { useQuery } from "@tanstack/react-query";
import { githubService } from "@/services/github.service";

interface UseRepositoriesParams {
  page?: number;
  perPage?: number;
  sort?: string;
  q?: string;
  type?: string;
  language?: string;
}

export function useRepositories({
  page = 1,
  perPage = 20,
  sort,
  q,
  type,
  language,
}: UseRepositoriesParams = {}) {
  return useQuery({
    queryKey: ["repos", page, perPage, sort, q, type, language],
    queryFn: () => githubService.getRepositories({ page, perPage, sort, q, type, language }),
  });
}

export function useRepository(owner: string, repo: string) {
  return useQuery({
    queryKey: ["repo", owner, repo],
    queryFn: () => githubService.getRepository(owner, repo),
    enabled: !!owner && !!repo,
  });
}

export function useRepositoryPullRequests(owner: string, repo: string) {
  return useQuery({
    queryKey: ["repo-pulls", owner, repo],
    queryFn: () => githubService.getRepositoryPullRequests(owner, repo),
    enabled: !!owner && !!repo,
  });
}

interface UsePullRequestParams {
  owner: string;
  repo: string;
  prNumber: number;
}

export function usePullRequest({
  owner,
  repo,
  prNumber,
}: UsePullRequestParams) {
  return useQuery({
    queryKey: ["pr", owner, repo, prNumber],
    queryFn: () => githubService.getPullRequest({ owner, repo, prNumber }),
    enabled: !!owner && !!repo && !!prNumber,
  });
}

export function usePullRequestFiles({
  owner,
  repo,
  prNumber,
}: UsePullRequestParams) {
  return useQuery({
    queryKey: ["pr-files", owner, repo, prNumber],
    queryFn: () => githubService.getPullRequestFiles(owner, repo, prNumber),
    enabled: !!owner && !!repo && !!prNumber,
  });
}
