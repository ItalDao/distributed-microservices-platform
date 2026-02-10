import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUsers, usePayments, useNotifications } from '../../shared/hooks';
import { PaymentMethod } from '../../shared/types';

const Dashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const { users, isLoading, error, fetchUsers, deleteUser } = useUsers();
  const {
    payments,
    isLoading: paymentsLoading,
    error: paymentsError,
    fetchPayments,
    createPayment,
  } = usePayments();
  const {
    stats,
    isLoading: statsLoading,
    error: statsError,
    fetchStats,
  } = useNotifications();
  const navigate = useNavigate();

  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentCurrency, setPaymentCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const canCreatePayment = useMemo(() => {
    const amount = Number(paymentAmount);
    return !!user?.id && !Number.isNaN(amount) && amount > 0 && !!paymentCurrency;
  }, [paymentAmount, paymentCurrency, user?.id]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchPayments(user?.id);
  }, [fetchPayments, user?.id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteUser(id);
    } catch {
      console.error('Failed to delete user');
    }
  };

  const handleCreatePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id) return;

    setPaymentSubmitting(true);
    try {
      await createPayment({
        userId: user.id,
        amount: Number(paymentAmount),
        currency: paymentCurrency,
        paymentMethod,
        description: paymentDescription || undefined,
      });
      setPaymentAmount('');
      setPaymentDescription('');
    } catch {
      console.error('Failed to create payment');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Users Management</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No users found</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">ID</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Created</th>
                  <th className="px-6 py-3 text-center text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-600 font-mono">
                      {user.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payments Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Payments</h2>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Payment</h3>
            <form onSubmit={handleCreatePayment} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Amount</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="100.00"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Currency</label>
                <input
                  type="text"
                  value={paymentCurrency}
                  onChange={(e) => setPaymentCurrency(e.target.value.toUpperCase())}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="USD"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Description</label>
                <input
                  type="text"
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="Demo payment"
                />
              </div>
              <div className="md:col-span-4 flex justify-end">
                <button
                  type="submit"
                  disabled={!canCreatePayment || paymentSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {paymentSubmitting ? 'Creating...' : 'Create Payment'}
                </button>
              </div>
            </form>
          </div>

          {paymentsError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {paymentsError}
            </div>
          )}

          {paymentsLoading ? (
            <div className="text-center py-8 text-gray-500">Loading payments...</div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No payments found</div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">ID</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Amount</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Method</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const paymentId = payment.id || payment._id || 'N/A';
                    return (
                      <tr key={paymentId} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-600 font-mono">
                          {paymentId !== 'N/A' ? `${paymentId.substring(0, 8)}...` : 'N/A'}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {payment.amount} {payment.currency}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600 capitalize">
                          {payment.status}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600 capitalize">
                          {payment.paymentMethod.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {payment.createdAt
                            ? new Date(payment.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Notifications Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Notifications</h2>

          {statsError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {statsError}
            </div>
          )}

          {statsLoading ? (
            <div className="text-center py-8 text-gray-500">Loading stats...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm text-gray-500">Total Sent</div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats?.totalSent ?? 0}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm text-gray-500">Success Rate</div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats?.successRate ?? 0}%
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm text-gray-500">Last Sent</div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats?.lastSent
                    ? new Date(stats.lastSent).toLocaleString()
                    : 'N/A'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
