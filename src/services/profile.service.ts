import apiClient from "@/lib/axios";
import type { DataResponse, ListData, SliceData } from "@/types/api";
import type {
  ActivityEntry,
  Profile,
  ProfileReviewingItem,
  ProfileStats,
  RecentPullRequest,
} from "@/types/profile";
import type { WalkthroughSummary } from "@/types/walkthrough";

export const profileService = {
  async getMyProfile(): Promise<Profile> {
    const { data } =
      await apiClient.get<DataResponse<Profile>>("/v1/profile/me");
    return data.data;
  },

  async getByUsername(username: string): Promise<Profile> {
    const { data } = await apiClient.get<DataResponse<Profile>>(
      `/v1/users/${username}`,
    );
    return data.data;
  },

  async getStats(username: string): Promise<ProfileStats> {
    const { data } = await apiClient.get<DataResponse<ProfileStats>>(
      `/v1/users/${username}/stats`,
    );
    return data.data;
  },

  async getUserWalkthroughs(
    username: string,
    status?: string,
  ): Promise<WalkthroughSummary[]> {
    const { data } = await apiClient.get<
      DataResponse<ListData<WalkthroughSummary>>
    >(`/v1/users/${username}/walkthroughs`, {
      params: status ? { status } : undefined,
    });
    return data.data.items;
  },

  async getActivity(
    username: string,
    before?: string,
    limit = 20,
  ): Promise<SliceData<ActivityEntry>> {
    const { data } = await apiClient.get<
      DataResponse<SliceData<ActivityEntry>>
    >(`/v1/users/${username}/activity`, { params: { before, limit } });
    return data.data;
  },

  async getReviewing(username: string): Promise<ProfileReviewingItem[]> {
    const { data } = await apiClient.get<
      DataResponse<ListData<ProfileReviewingItem>>
    >(`/v1/users/${username}/reviewing`);
    return data.data.items;
  },

  async getRecentPullRequests(perPage = 10): Promise<RecentPullRequest[]> {
    const { data } = await apiClient.get<
      DataResponse<ListData<RecentPullRequest>>
    >("/v1/github/pulls/recent", { params: { perPage } });
    return data.data.items;
  },
};
