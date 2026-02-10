import { useState, useCallback } from 'react';
import { Payment } from '../types';
import { paymentService } from '../services';

interface UsePaymentsReturn {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  fetchPayments: (userId?: string) => Promise<void>;
  createPayment: (
    payload: Omit<Payment, 'id' | '_id' | 'status' | 'createdAt' | 'updatedAt'>,
  ) => Promise<Payment>;
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

  const createPayment = useCallback(
    async (payload: Omit<Payment, 'id' | '_id' | 'status' | 'createdAt' | 'updatedAt'>) => {
      setError(null);
      try {
        const created = await paymentService.create(payload);
        setPayments((prev) => [created, ...prev]);
        return created;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Failed to create payment';
        setError(message);
        throw err;
      }
    },
    [],
  );

  return {
    payments,
    isLoading,
    error,
    fetchPayments,
    createPayment,
    refetch: fetchPayments,
  };
};
