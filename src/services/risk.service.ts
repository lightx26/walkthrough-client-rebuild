import apiClient from '@/lib/axios';
import type { DataResponse } from '@/types/api';
import type { RiskScan, RiskZone } from '@/types/risk';

export const riskService = {
  async triggerScan(walkthroughId: string): Promise<DataResponse<RiskScan>> {
    const { data } = await apiClient.post<DataResponse<RiskScan>>(
      `/v1/walkthroughs/${walkthroughId}/risk/scan`,
    );
    return data;
  },

  async getScan(walkthroughId: string): Promise<DataResponse<RiskScan>> {
    const { data } = await apiClient.get<DataResponse<RiskScan>>(
      `/v1/walkthroughs/${walkthroughId}/risk/scan`,
    );
    return data;
  },

  async markReviewed(
    walkthroughId: string,
    riskId: string,
    reviewed: boolean,
  ): Promise<DataResponse<RiskZone>> {
    const { data } = await apiClient.post<DataResponse<RiskZone>>(
      `/v1/walkthroughs/${walkthroughId}/risk/zones/${riskId}/review`,
      { reviewed },
    );
    return data;
  },
};
