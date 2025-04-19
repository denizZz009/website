"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // User is not authenticated, redirect to login
        router.push('/auth/login');
      } else if (requireAdmin && !isAdmin) {
        // User is authenticated but not admin, redirect to home
        router.push('/');
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, requireAdmin, router]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // If not authenticated or doesn't have required permissions, don't render children
  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  // Authenticated and has proper permissions
  return <>{children}</>;
}
