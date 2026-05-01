import apiClient from "@/lib/axios";
import type { DataResponse } from "@/types/api";
import type { User } from "@/types/auth";

export const authService = {
  async loginWithGitHub(code: string): Promise<DataResponse<User>> {
    const { data } = await apiClient.post("/v1/auth/github", { code });
    return data;
  },

  async getMe(): Promise<DataResponse<User>> {
    const { data } = await apiClient.get("/v1/auth/me");
    return data;
  },

  async logout(): Promise<DataResponse<void>> {
    const { data } = await apiClient.post("/v1/auth/logout");
    return data;
  },
};
