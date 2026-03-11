import { useState, useEffect } from 'react';
import { historyService, type HistoryItem, type HistoryResponse } from '../services/historyService';

interface UseHistoryReturn {
  history: HistoryItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useHistory(params?: { limit?: number; mine?: boolean }): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: HistoryResponse = await historyService.getHistory(params);
      setHistory(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
      console.error('Error fetching history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [params?.limit, params?.mine]);

  return {
    history,
    isLoading,
    error,
    refetch: fetchHistory,
  };
}
