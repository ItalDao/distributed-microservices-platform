import { useState, useCallback } from 'react';
import { Payment } from '../types';
import { paymentService } from '../services';

interface UsePaymentsReturn {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  fetchPayments: (userId?: string) => Promise<void>;
  refetch: (userId?: string) => Promise<void>;
}

export const usePayments = (): UsePaymentsReturn => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async (userId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await paymentService.getAll(userId);
      setPayments(data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch payments';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    payments,
    isLoading,
    error,
    fetchPayments,
    refetch: fetchPayments,
  };
};
