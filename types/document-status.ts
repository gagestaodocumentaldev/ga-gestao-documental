export type StatusType = 'no_expiry' | 'expired' | 'critical' | 'warning' | 'ok';

export interface DocumentStatus {
  diasParaVencer: number | null;
  status: StatusType;
  statusLabel: string;
}
