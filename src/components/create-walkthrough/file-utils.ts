import type { PrFile } from '@/types/github';

export const DRAG_TYPE_PR_FILE = 'PR_FILE';
export const DRAG_TYPE_PR_DIR = 'PR_DIR';

export function statusBadge(status: PrFile['status']) {
  if (status === 'added') return { label: 'A', cls: 'bg-green-100 text-green-700' };
  if (status === 'removed') return { label: 'D', cls: 'bg-red-100 text-red-700' };
  if (status === 'renamed') return { label: 'R', cls: 'bg-purple-100 text-purple-700' };
  return { label: 'M', cls: 'bg-blue-100 text-blue-700' };
}

export function baseName(filename: string) {
  return filename.split('/').pop() ?? filename;
}
