'use client';

import { useRef } from 'react';

import { cn } from '@/lib/utils';
import type { PrFile } from '@/types/github';
import { CheckCircle2, FileCode2, FileText, GripVertical, Settings } from 'lucide-react';
import { useDrag } from 'react-dnd';

import { DRAG_TYPE_PR_FILE, baseName, statusBadge } from './file-utils';

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'sql') return <FileCode2 className="h-3.5 w-3.5 shrink-0 text-blue-400" />;
  if (ext === 'yml' || ext === 'yaml')
    return <Settings className="h-3.5 w-3.5 shrink-0 text-green-500" />;
  return <FileText className="h-3.5 w-3.5 shrink-0 text-orange-400" />;
}

interface PanelFileRowProps {
  file: PrFile;
  assigned: boolean;
  onClick?: (file: PrFile) => void;
}

export function PanelFileRow({ file, assigned, onClick }: PanelFileRowProps) {
  const badge = statusBadge(file.status);
  const nodeRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPE_PR_FILE,
    item: { type: DRAG_TYPE_PR_FILE, file },
    canDrag: !assigned,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(nodeRef);

  return (
    <div
      ref={nodeRef}
      title={file.filename}
      onClick={() => onClick?.(file)}
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors',
        assigned ? 'opacity-50' : 'cursor-grab hover:bg-gray-100 active:cursor-grabbing',
        isDragging && 'opacity-30'
      )}
    >
      {assigned ? (
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-gray-400" />
      ) : (
        <GripVertical className="h-3.5 w-3.5 shrink-0 text-gray-300" />
      )}
      {getFileIcon(file.filename)}
      <span
        className={cn(
          'min-w-0 flex-1 truncate font-mono text-xs',
          assigned ? 'text-gray-400' : 'text-gray-700'
        )}
      >
        {baseName(file.filename)}
      </span>
      {!assigned && (file.additions > 0 || file.deletions > 0) && (
        <span className="shrink-0 font-mono text-[10px]">
          <span className="text-green-600">+{file.additions}</span>{' '}
          <span className="text-red-400">-{file.deletions}</span>
        </span>
      )}
      <span className={cn('shrink-0 rounded px-1 py-0.5 text-[10px] font-bold', badge.cls)}>
        {badge.label}
      </span>
    </div>
  );
}
