export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskScanStatus = 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';

export interface RiskFileProgress {
  filename: string;
  status: 'pending' | 'analyzing' | 'done' | 'failed' | 'skipped';
  reason?: string;
}

export interface RiskCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface RiskZone {
  id: string;
  level: RiskLevel;
  category: string;
  categoryLabel: string;
  title: string;
  description: string;
  suggestion?: string;
  filename: string;
  walkthroughFileId: string;
  startPosition?: number;
  endPosition?: number;
  lineSide?: string;
  reviewStatus: 'OPEN' | 'REVIEWED';
}

export interface RiskScan {
  scanId: string;
  status: RiskScanStatus;
  provider?: string;
  model?: string;
  totalFiles: number;
  analyzedFiles: number;
  counts: RiskCounts;
  fileProgress: RiskFileProgress[];
  risks: RiskZone[];
}
