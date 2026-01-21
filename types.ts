
export enum ChangeType {
  ADDED = 'ADDED',
  REMOVED = 'REMOVED',
  MODIFIED = 'MODIFIED',
  BREAKING = 'BREAKING'
}

export interface SpecChange {
  type: ChangeType;
  endpoint: string;
  method: string;
  description: string;
  technicalDetail: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ComparisonResult {
  summary: string;
  versionOld: string;
  versionNew: string;
  changes: SpecChange[];
}
