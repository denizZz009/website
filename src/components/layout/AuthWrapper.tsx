"use client";

import { useAuthContext } from "@/components/layout/AuthProvider";

export type AuthWrapperProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
};

export default function AuthWrapper({
  children,
  fallback,
  requireAuth = false
}: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return fallback || null;
  }

  return <>{children}</>;
}
