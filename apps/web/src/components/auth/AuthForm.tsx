'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../store/auth';

type AuthMode = 'login' | 'signup';

const config = {
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in to your account to continue designing.',
    submitText: 'Sign in',
    loadingText: 'Signing in...',
    switchText: "Don't have an account?",
    switchLabel: 'Sign up',
    switchHref: '/signup',
  },
  signup: {
    title: 'Create an account',
    subtitle: 'Start designing in seconds. Free to use.',
    submitText: 'Create account',
    loadingText: 'Creating account...',
    switchText: 'Already have an account?',
    switchLabel: 'Sign in',
    switchHref: '/login',
  },
} as const;

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const { login, register, clearError } = useAuthStore();
  const c = config[mode];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    clearError();

    try {
      if (mode === 'signup') {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{c.title}</h2>
      <p className="mt-2 text-sm text-gray-500">{c.subtitle}</p>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {mode === 'signup' && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              placeholder="Jane Doe"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          {loading ? c.loadingText : c.submitText}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        {c.switchText}{' '}
        <Link href={c.switchHref} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          {c.switchLabel}
        </Link>
      </p>
    </>
  );
}
