import apiClient from "@/lib/axios";
import type { DataResponse, ListData } from "@/types/api";
import type {
  CreateTemplateRequest,
  DuplicateTemplateRequest,
  Template,
  TemplatePrType,
  TemplateSummary,
  UpdateTemplateRequest,
} from "@/types/template";

export const templateService = {
  async list(prType?: TemplatePrType): Promise<DataResponse<ListData<Template>>> {
    const { data } = await apiClient.get<DataResponse<ListData<Template>>>(
      "/v1/templates",
      { params: prType ? { prType } : undefined },
    );
    return data;
  },

  async getById(id: string): Promise<DataResponse<Template>> {
    const { data } = await apiClient.get<DataResponse<Template>>(
      `/v1/templates/${id}`,
    );
    return data;
  },

  async create(request: CreateTemplateRequest): Promise<DataResponse<Template>> {
    const { data } = await apiClient.post<DataResponse<Template>>(
      "/v1/templates",
      request,
    );
    return data;
  },

  async update(
    id: string,
    request: UpdateTemplateRequest,
  ): Promise<DataResponse<Template>> {
    const { data } = await apiClient.patch<DataResponse<Template>>(
      `/v1/templates/${id}`,
      request,
    );
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/v1/templates/${id}`);
  },

  async duplicate(
    id: string,
    request?: DuplicateTemplateRequest,
  ): Promise<DataResponse<Template>> {
    const { data } = await apiClient.post<DataResponse<Template>>(
      `/v1/templates/${id}/duplicate`,
      request ?? {},
    );
    return data;
  },

  async topDuplicated(
    limit = 5,
  ): Promise<DataResponse<ListData<TemplateSummary>>> {
    const { data } = await apiClient.get<DataResponse<ListData<TemplateSummary>>>(
      "/v1/templates/stats/top-duplicated",
      { params: { limit } },
    );
    return data;
  },
};
