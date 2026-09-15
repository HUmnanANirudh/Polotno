'use client';

import Link from 'next/link';
import { useAuthStore } from '../../store/auth';
import { CloudShader } from './Cloud';
import { Logo } from '../ui/Logo';

export default function LandingHero() {
  const { user, isLoading } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-blue-500">
      <div className="absolute inset-0 z-0">
        <CloudShader speed={0.5} count={5} />
      </div>
      <header className="absolute top-0 w-full h-24 flex items-center justify-between px-8 md:px-16 lg:px-24 z-50">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="font-bold text-white text-2xl tracking-tight">Polotno</span>
        </div>

        <div className="flex items-center">
          {!isLoading && (
            <>
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-6 py-2.5 bg-white text-gray-900 font-semibold text-sm rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-6 py-2.5 bg-white text-gray-900 font-semibold text-sm rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Sign in
                </Link>
              )}
            </>
          )}
        </div>
      </header>
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-3xl">
          <h1 
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-white tracking-tight leading-[1.05] mb-8"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          >
            Your window seat to limitless design
          </h1>
          <p 
            className="text-lg md:text-2xl text-white/90 max-w-2xl leading-relaxed mb-12 font-medium" 
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
          >
            Create, collaborate, and bring your visual ideas to life with a canvas that works the way you think.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href={user ? '/dashboard' : '/signup'}
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-50 transition-colors shadow-lg text-lg"
            >
              Start designing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
