import { apiClient } from './apiClient';
import {
  User,
  LoginRequest,
  AuthResponse,
  Payment,
  NotificationStats,
} from '../types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });
    return data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const userService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  update: async (id: string, updates: Partial<User>): Promise<User> => {
    const { data } = await apiClient.put<User>(`/users/${id}`, updates);
    return data;
  },
};

export const paymentService = {
  getAll: async (userId?: string): Promise<Payment[]> => {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const { data } = await apiClient.get<Payment[]>(`/payments${query}`);
    return data;
  },
  create: async (
    payload: Omit<Payment, 'id' | '_id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Promise<Payment> => {
    const { data } = await apiClient.post<Payment>('/payments', payload);
    return data;
  },
};

export const notificationsService = {
  getStats: async (): Promise<NotificationStats> => {
    const { data } = await apiClient.get<NotificationStats>('/notifications/stats');
    return data;
  },
};
