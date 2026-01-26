import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import * as authService from '../services/index';

vi.mock('../services/index');

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeUndefined();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should login successfully', async () => {
    const mockUser = {
      id: 'uuid-123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      createdAt: '2026-01-22T00:00:00.000Z',
      updatedAt: '2026-01-22T00:00:00.000Z',
    };

    vi.spyOn(authService, 'authService', 'get').mockReturnValue({
      login: vi.fn().mockResolvedValue({
        user: mockUser,
        accessToken: 'token-123',
      }),
      logout: vi.fn(),
      getToken: vi.fn(),
      isAuthenticated: vi.fn(),
      getCurrentUser: vi.fn(),
      register: vi.fn(),
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).toBeTruthy();
  });

  it('should handle login error', async () => {
    vi.spyOn(authService, 'authService', 'get').mockReturnValue({
      login: vi.fn().mockRejectedValue({
        response: { data: { message: 'Invalid credentials' } },
      }),
      logout: vi.fn(),
      getToken: vi.fn(),
      isAuthenticated: vi.fn(),
      getCurrentUser: vi.fn(),
      register: vi.fn(),
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.login({
          email: 'wrong@example.com',
          password: 'wrong',
        });
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should logout successfully', () => {
    const { result } = renderHook(() => useAuth());

    // Set user first
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 'uuid-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }),
    );
    localStorage.setItem('token', 'token-123');

    vi.spyOn(authService, 'authService', 'get').mockReturnValue({
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      isAuthenticated: vi.fn(),
      getCurrentUser: vi.fn(),
      register: vi.fn(),
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
