import { useState, useCallback } from 'react';
import {
  NotificationStats,
  NotificationSendRequest,
  NotificationSendResponse,
} from '../types';
import { notificationsService } from '../services';

interface UseNotificationsReturn {
  stats: NotificationStats | null;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  sendNotification: (payload: NotificationSendRequest) => Promise<NotificationSendResponse>;
  refetch: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
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

  const sendNotification = useCallback(
    async (payload: NotificationSendRequest) => {
      setIsSending(true);
      setError(null);
      try {
        const response = await notificationsService.send(payload);
        return response;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Failed to send notification';
        setError(message);
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [],
  );

  return {
    stats,
    isLoading,
    isSending,
    error,
    fetchStats,
    sendNotification,
    refetch: fetchStats,
  };
};
