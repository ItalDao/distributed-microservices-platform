import { useState, useCallback } from 'react';
import { NotificationStats } from '../types';
import { notificationsService } from '../services';

interface UseNotificationsReturn {
  stats: NotificationStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationsService.getStats();
      setStats(data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch notifications stats';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    stats,
    isLoading,
    error,
    fetchStats,
    refetch: fetchStats,
  };
};
