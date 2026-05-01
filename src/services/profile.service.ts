// import apiClient from "@/lib/axios";
// import type { DataResponse, ListData, SliceData } from "@/types/api";
// import type {
//   ActivityEntry,
//   PinnedWalkthrough,
//   PinWalkthroughRequest,
//   Profile,
//   ProfileStats,
//   ReorderPinsRequest,
// } from "@/types/profile";
// import type { WalkthroughSummary } from "@/types/walkthrough";
//
// export const profileService = {
//   async getMyProfile(): Promise<DataResponse<Profile>> {
//     const { data } = await apiClient.get<DataResponse<Profile>>(
//       "/v1/profile/me",
//     );
//     return data;
//   },
//
//   async getByUsername(username: string): Promise<DataResponse<Profile>> {
//     const { data } = await apiClient.get<DataResponse<Profile>>(
//       `/v1/users/${username}`,
//     );
//     return data;
//   },
//
//   async getStats(username: string): Promise<DataResponse<ProfileStats>> {
//     const { data } = await apiClient.get<DataResponse<ProfileStats>>(
//       `/v1/users/${username}/stats`,
//     );
//     return data;
//   },
//
//   async getUserWalkthroughs(
//     username: string,
//   ): Promise<DataResponse<ListData<WalkthroughSummary>>> {
//     const { data } = await apiClient.get<
//       DataResponse<ListData<WalkthroughSummary>>
//     >(`/v1/users/${username}/walkthroughs`);
//     return data;
//   },
//
//   async getPins(
//     username: string,
//   ): Promise<DataResponse<ListData<PinnedWalkthrough>>> {
//     const { data } = await apiClient.get<
//       DataResponse<ListData<PinnedWalkthrough>>
//     >(`/v1/users/${username}/pins`);
//     return data;
//   },
//
//   async getActivity(
//     username: string,
//     before?: string,
//     limit: number = 50,
//   ): Promise<DataResponse<SliceData<ActivityEntry>>> {
//     const { data } = await apiClient.get<
//       DataResponse<SliceData<ActivityEntry>>
//     >(`/v1/users/${username}/activity`, {
//       params: { before, limit },
//     });
//     return data;
//   },
//
//   async pinWalkthrough(
//     request: PinWalkthroughRequest,
//   ): Promise<DataResponse<PinnedWalkthrough>> {
//     const { data } = await apiClient.post<DataResponse<PinnedWalkthrough>>(
//       "/v1/profile/me/pins",
//       request,
//     );
//     return data;
//   },
//
//   async reorderPins(request: ReorderPinsRequest): Promise<void> {
//     await apiClient.put("/v1/profile/me/pins", request);
//   },
//
//   async unpinWalkthrough(pinId: string): Promise<void> {
//     await apiClient.delete(`/v1/profile/me/pins/${pinId}`);
//   },
// };
