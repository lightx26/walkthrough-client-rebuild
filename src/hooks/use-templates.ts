'use client';

import { templateService } from '@/services/template.service';
import type {
  CreateTemplateRequest,
  DuplicateTemplateRequest,
  TemplatePrType,
  UpdateTemplateRequest,
} from '@/types/template';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const TEMPLATES_KEY = ['templates'] as const;

export function useTemplates(prType?: TemplatePrType) {
  return useQuery({
    queryKey: [...TEMPLATES_KEY, { prType: prType ?? null }],
    queryFn: () => templateService.list(prType),
  });
}

export function useTemplate(id: string | null | undefined) {
  return useQuery({
    queryKey: [...TEMPLATES_KEY, 'detail', id],
    queryFn: () => templateService.getById(id as string),
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateTemplateRequest) => templateService.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY });
    },
  });
}

export function useUpdateTemplate(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateTemplateRequest) => templateService.update(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => templateService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY });
    },
  });
}

export function useTopDuplicatedTemplates(limit = 5) {
  return useQuery({
    queryKey: [...TEMPLATES_KEY, 'stats', 'top-duplicated', { limit }],
    queryFn: () => templateService.topDuplicated(limit),
  });
}

export function useDuplicateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request?: DuplicateTemplateRequest }) =>
      templateService.duplicate(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY });
    },
  });
}
