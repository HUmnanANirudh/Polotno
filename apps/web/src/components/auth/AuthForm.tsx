'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../store/auth';
import { loginSchema, registerSchema } from '@polotno/types';
import toast from 'react-hot-toast';
import { SpinnerGapIcon } from '@phosphor-icons/react';

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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    clearError();

    try {
      if (mode === 'signup') {
        registerSchema.parse({ name, email, password });
      } else {
        loginSchema.parse({ email, password });
      }
    } catch (err: any) {
      if (err.name === 'ZodError' || err.issues) {
        const errors: Record<string, string> = {};
        const issues = err.issues || err.errors || [];
        issues.forEach((errItem: any) => {
          if (errItem.path[0]) {
            errors[errItem.path[0].toString()] = errItem.message;
          }
        });
        setFormErrors(errors);
        toast.error('Please fix the errors in the form');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      toast.success('Successfully logged in!');
      router.push('/dashboard');
    } catch (err) {
      const e = err as Error;
      toast.error(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{c.title}</h2>
      <p className="mt-2 text-sm text-gray-500">{c.subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
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
              onChange={(e) => {
                setName(e.target.value);
                if (formErrors.name) setFormErrors(prev => ({ ...prev, name: '' }));
              }}
              className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${
                formErrors.name ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Jane Doe"
            />
            {formErrors.name && (
              <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
            )}
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
            onChange={(e) => {
              setEmail(e.target.value);
              if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
            }}
            className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${
              formErrors.email ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="you@example.com"
          />
          {formErrors.email && (
            <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
          )}
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
            onChange={(e) => {
              setPassword(e.target.value);
              if (formErrors.password) setFormErrors(prev => ({ ...prev, password: '' }));
            }}
            className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${
              formErrors.password ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
          />
          {formErrors.password && (
            <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          {loading && <SpinnerGapIcon size={18} className="animate-spin" />}
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
