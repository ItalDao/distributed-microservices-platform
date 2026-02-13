import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks';
import { LoginRequest } from '../../shared/types';
import { ui } from '../../shared/i18n';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');

    const credentials: LoginRequest = { email, password };

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch {
      setLocalError(error || ui.loginError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">{ui.loginTitle}</h1>
        <p className="text-center text-sm text-gray-500 mb-6">{ui.loginSubtitle}</p>

        {(localError || error) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder={ui.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder={ui.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isLoading ? ui.loginLoading : ui.loginButton}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          {ui.loginSubtitle}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
