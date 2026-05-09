"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { searchService } from "@/services/search.service";
import type { SearchFilters } from "@/types/search";

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useWalkthroughSearch(query: string, filters?: SearchFilters) {
  const debouncedQuery = useDebounce(query, 300);
  const isWaitingForDebounce =
    query.trim().length > 0 && query !== debouncedQuery;

  const searchQuery = useQuery({
    queryKey: ["search", "walkthroughs", debouncedQuery, filters],
    queryFn: () =>
      searchService.searchWalkthroughs({
        query: debouncedQuery,
        size: 10,
        filters,
      }),
    enabled: debouncedQuery.trim().length > 0,
    placeholderData: (prev) => prev,
  });

  return {
    ...searchQuery,
    isWaitingForDebounce,
  };
}

export function useSearchHistory() {
  return useQuery({
    queryKey: ["search", "history"],
    queryFn: () => searchService.getHistory(),
    staleTime: 0,
  });
}

export function useSaveSearchHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (query: string) => searchService.saveHistory(query),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search", "history"] });
    },
  });
}

export function useUserSearch(query: string) {
  const debouncedQuery = useDebounce(query, 200);
  return useQuery({
    queryKey: ["users", "search", debouncedQuery],
    queryFn: () => searchService.searchUsers(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
    placeholderData: (prev) => prev,
  });
}

export function useRepoSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);
  const isWaitingForDebounce = query.trim().length > 0 && query !== debouncedQuery;

  const searchQuery = useQuery({
    queryKey: ["search", "repos", debouncedQuery],
    queryFn: () => searchService.searchRepos(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
    placeholderData: (prev) => prev,
  });

  return { ...searchQuery, isWaitingForDebounce };
}

export function usePRSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);
  const isWaitingForDebounce = query.trim().length > 0 && query !== debouncedQuery;

  const { data, isFetching } = useQuery({
    queryKey: ["search", "prs", debouncedQuery],
    queryFn: () => searchService.searchPRs(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
    placeholderData: (prev) => prev,
  });

  const hits = data?.data?.items ?? [];

  return { hits, isFetching, isWaitingForDebounce };
}
