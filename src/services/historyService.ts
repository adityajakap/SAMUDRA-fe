import { authService } from './authService';

const API_BASE_URL = 'https://backend.fruz.cloud';

export interface HistoryItem {
  id: string;
  eventType: string;
  alertId: string;
  reportId: string;
  serverTimestamp: number;
  client: {
    clientReportId: string | null;
    createdAtClient: number | null;
  };
  decision: {
    is_high_risk: boolean;
    is_multisign: boolean;
    shouldDistribute: boolean;
  };
  input: {
    lik_codes: string[];
  };
  ml: {
    is_high_risk: boolean;
    confidence: number;
  };
  reporter?: {
    userId: string;
    email: string;
  };
}

export interface HistoryResponse {
  ok: boolean;
  items: HistoryItem[];
  count: number;
  filter: {
    mine: boolean;
    userId: string | null;
  };
}

export class HistoryError extends Error {
  statusCode?: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If we can't parse the error response, use the default message
    }
    const error = new HistoryError(errorMessage);
    error.statusCode = response.status;
    throw error;
  }
  
  return response.json();
}

function getAuthHeaders(): HeadersInit {
  const token = authService.getToken();
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
  return {
    'Content-Type': 'application/json',
  };
}

export const historyService = {
  async getHistory(params?: { limit?: number; mine?: boolean }): Promise<HistoryResponse> {
    const limit = params?.limit ?? 20;
    const mine = params?.mine ?? true;
    
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      mine: mine.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/api/history?${queryParams}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<HistoryResponse>(response);
  },
};
