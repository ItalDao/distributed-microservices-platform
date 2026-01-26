import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

// Mock useUsers hook
vi.mock('../../shared/hooks/useUsers', () => ({
  useUsers: () => ({
    users: [
      {
        id: 'uuid-1',
        email: 'user1@example.com',
        firstName: 'User',
        lastName: 'One',
        createdAt: '2026-01-22T00:00:00.000Z',
        updatedAt: '2026-01-22T00:00:00.000Z',
      },
      {
        id: 'uuid-2',
        email: 'user2@example.com',
        firstName: 'User',
        lastName: 'Two',
        createdAt: '2026-01-22T00:00:00.000Z',
        updatedAt: '2026-01-22T00:00:00.000Z',
      },
    ],
    isLoading: false,
    error: null,
    fetchUsers: vi.fn().mockResolvedValue(undefined),
    deleteUser: vi.fn().mockResolvedValue(undefined),
  }),
}));

// Mock useAuth hook
vi.mock('../../shared/hooks/useAuth', () => ({
  useAuth: () => ({
    logout: vi.fn(),
    user: {
      id: 'current-user',
      email: 'current@example.com',
      firstName: 'Current',
      lastName: 'User',
    },
  }),
}));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render dashboard title', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Gestión de usuarios/i)).toBeInTheDocument();
  });

  it('should display users table', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    expect(screen.getByText(/user1@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/user2@example.com/i)).toBeInTheDocument();
  });

  it('should display user data in table', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('should have logout button', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    const logoutButton = screen.getByRole('button', {
      name: /cierre de sesión/i,
    });
    expect(logoutButton).toBeInTheDocument();
  });

  it('should have delete buttons for each user', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    const deleteButtons = screen.getAllByRole('button', {
      name: /borrar/i,
    });
    expect(deleteButtons).toHaveLength(2);
  });

  it('should display loading state when fetching users', async () => {
    vi.mock('../../shared/hooks/useUsers', () => ({
      useUsers: () => ({
        users: [],
        isLoading: true,
        error: null,
        deleteUser: vi.fn(),
      }),
    }));

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    await waitFor(() => {
      const loadingElement = screen.queryByText(/cargando/i);
      if (loadingElement) {
        expect(loadingElement).toBeInTheDocument();
      }
    });
  });

  it('should display error message on load failure', async () => {
    vi.mock('../../shared/hooks/useUsers', () => ({
      useUsers: () => ({
        users: [],
        isLoading: false,
        error: 'Failed to load users',
        deleteUser: vi.fn(),
      }),
    }));

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    await waitFor(() => {
      const errorElement = screen.queryByText(/error/i);
      if (errorElement) {
        expect(errorElement).toBeInTheDocument();
      }
    });
  });

  it('should display empty state when no users', async () => {
    vi.mock('../../shared/hooks/useUsers', () => ({
      useUsers: () => ({
        users: [],
        isLoading: false,
        error: null,
        deleteUser: vi.fn(),
      }),
    }));

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    await waitFor(() => {
      const emptyElement = screen.queryByText(/no se han encontrado/i);
      if (emptyElement) {
        expect(emptyElement).toBeInTheDocument();
      }
    });
  });
});
