import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '../types';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token
// Request interceptor - Add token (defensive: guard against undefined headers/interceptors in test env)
if (apiClient && apiClient.interceptors && apiClient.interceptors.request) {
  apiClient.interceptors.request.use((config) => {
    try {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        // ensure headers object exists
        config.headers = config.headers || {};
        // set Authorization header in a safe way
        // @ts-ignore - axios header types can be loose in tests
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Silently ignore issues accessing localStorage in non-browser test environments
    }
    return config;
  });
}

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
