"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, AuthState } from '@/hooks/use-auth';

const AuthContext = createContext<AuthState | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [mounted, setMounted] = useState(false);

  // Wait until after client-side hydration to show
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // This prevents a hydration error
    return <>{children}</>;
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
