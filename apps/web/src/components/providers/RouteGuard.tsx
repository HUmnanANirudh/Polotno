'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/auth';
import { SpinnerGapIcon } from '@phosphor-icons/react';

const PUBLIC_ROUTES = ['/', '/login', '/signup'];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;

    // Check if the current route is in the public list
    // (exact match for home, login, signup)
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!user && !isPublicRoute) {
      // Unauthenticated user trying to access a private route -> redirect to login
      router.push('/login');
    } else if (user && (pathname === '/login' || pathname === '/signup')) {
      // Authenticated user trying to access auth pages -> redirect to dashboard
      router.push('/dashboard');
    }
  }, [user, isLoading, pathname, router, mounted]);

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) return null;

  // Show a global loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <SpinnerGapIcon size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // If not authenticated and not a public route, render nothing (will redirect)
  if (!user && !isPublicRoute) {
    return null;
  }

  // Render the protected or public content
  return <>{children}</>;
}
