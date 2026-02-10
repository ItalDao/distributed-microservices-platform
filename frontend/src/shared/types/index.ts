export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'bank_transfer';

export interface Payment {
  id?: string;
  _id?: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  description?: string;
  transactionId?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationStats {
  totalSent: number;
  successRate: number;
  lastSent: string;
}

export type NotificationType = 'welcome' | 'payment-confirmation' | 'custom';

export interface NotificationSendRequest {
  email: string;
  type: NotificationType;
  data?: {
    firstName?: string;
    lastName?: string;
    amount?: number;
    currency?: string;
    transactionId?: string;
    message?: string;
  };
}

export interface NotificationSendResponse {
  success: boolean;
  message: string;
}
