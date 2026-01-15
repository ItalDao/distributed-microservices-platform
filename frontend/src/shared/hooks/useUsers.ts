import { useState, useCallback } from 'react';
import { User } from '../types';
import { userService } from '../services';

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch users';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    try {
      await userService.delete(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete user';
      setError(message);
      throw err;
    }
  }, []);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    deleteUser,
    refetch: fetchUsers,
  };
};
