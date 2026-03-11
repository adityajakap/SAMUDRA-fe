// Observation Types
export interface IObservation {
  attribute: string;
  object: string;
  value: string;
  label: string;
}

// Report Types based on API schema
export type BeachLocation = 
  | 'pantai_lampuuk'
  | 'pantai_lhoknga'
  | 'pantai_ulee_lheue'
  | 'pantai_depok'
  | 'pantai_samas';

export interface PredictionInput {
  lik_codes: string[];
  beach_location: BeachLocation;
  clientReportId?: string;
  createdAtClient?: number;
}

export interface ReportResponse {
  success: boolean;
  alertId?: string;
  message?: string;
}

// History Types
export interface HistoryItem {
  id: string;
  userId: string;
  lik_codes: string[];
  beach_location: BeachLocation;
  createdAt: number;
  alertId?: string;
}

export interface HistoryResponse {
  items: HistoryItem[];
  count: number;
}

// ACK Types
export type TransportType = 'SSE' | 'WS' | 'PUSH';
export type AckStage = 'DELIVERED' | 'OPENED';

export interface AckInput {
  alertId: string;
  transport: TransportType;
  receivedAtClient: number;
  serverTimestamp: number;
  ackStage?: AckStage;
  clientId?: string;
}

// Push Subscription Types
export interface PushSubscription {
  endpoint: string;
  expirationTime?: number;
  keys: {
    p256dh: string;
    auth: string;
  };
}
