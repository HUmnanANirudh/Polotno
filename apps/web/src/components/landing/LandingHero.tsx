'use client';

import Link from 'next/link';
import { useAuthStore } from '../../store/auth';
import { ArrowRightIcon } from '@phosphor-icons/react';

export default function LandingHero() {
  const { user, isLoading } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-sm" />
          <span className="font-bold text-gray-900 tracking-tight">Polotno</span>
        </div>
        {!isLoading && (
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  Sign up free
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Design without
            <span className="text-blue-600"> boundaries</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
            A simple, powerful canvas editor for creating visual compositions. 
            Add shapes, text, and images — then save your work to the cloud.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href={user ? '/dashboard' : '/signup'}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Get Started
              <ArrowRightIcon size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
