import { useState, useEffect } from 'react';
import { api, setToken, clearToken, getAccessToken } from '@/lib/api';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
  phone?: string;
  address?: string;
}

interface JWTPayload {
  user_id: string;
  username: string;
  email: string;
  exp: number;
  iat: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message?: string; error?: string; requiresVerification?: boolean }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyEmailChange: (token: string, email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<Omit<AuthState, 'login' | 'register' | 'logout' | 'forgotPassword' | 'resetPassword' | 'updateProfile' | 'changePassword' | 'verifyEmailChange'>>({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true
  });

  // Check if token is valid and extract user info
  const parseJWT = (): User | null => {
    try {
      const token = getAccessToken();
      if (!token) return null;

      const decoded = jwtDecode<JWTPayload>(token);

      // Check if token has expired
      if (decoded.exp * 1000 < Date.now()) {
        clearToken();
        return null;
      }

      // Return user info from token
      return {
        id: decoded.user_id,
        username: decoded.username,
        email: decoded.email,
        // In a real application, you might encode isAdmin in the token
        // For now, we'll assume admin status based on email domain
        isAdmin: decoded.email.endsWith('@admin.com')
      };
    } catch (error) {
      console.error('Error parsing JWT:', error);
      clearToken();
      return null;
    }
  };

  // Check authentication status on mount and token changes
  const checkAuth = () => {
    const user = parseJWT();

    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
        isAdmin: user.isAdmin || false,
        isLoading: false
      });
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false
      });
    }
  };

  useEffect(() => {
    // Check auth on initial load
    checkAuth();

    // Add event listener for storage events to handle token changes in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check auth every 5 minutes to handle token expiration
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login(email, password);

      if (response.status !== 'success' || !response.token) {
        throw new Error(response.message || 'Giriş yapılırken bir hata oluştu');
      }

      // Store token
      setToken(response.token);

      // Parse user data from token
      const user = parseJWT();
      if (!user) {
        throw new Error('Invalid token received from server');
      }

      setAuthState({
        user,
        isAuthenticated: true,
        isAdmin: user.isAdmin || false,
        isLoading: false
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Giriş yapılırken bir hata oluştu'
      };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await api.auth.register(username, email, password);

      if (response.status !== 'success') {
        throw new Error(response.message || 'Kayıt yapılırken bir hata oluştu');
      }

      return {
        success: true,
        message: response.message || 'Kayıt başarılı! Lütfen e-posta adresinizi onaylayın.'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Kayıt yapılırken bir hata oluştu'
      };
    }
  };

  const logout = async () => {
    try {
      // Just clear token, no need for server logout with JWT
      clearToken();

      setAuthState({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false
      });

      return { success: true };
    } catch (error) {
      // Still clear token even if there's an error
      clearToken();

      setAuthState({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Çıkış yapılırken bir hata oluştu'
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await api.auth.forgotPassword(email);

      if (response.status !== 'success') {
        throw new Error(response.message || 'Şifre sıfırlama isteği gönderilirken bir hata oluştu');
      }

      return {
        success: true,
        message: response.message || 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Şifre sıfırlama isteği gönderilirken bir hata oluştu'
      };
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await api.auth.resetPassword(token, newPassword);

      if (response.status !== 'success') {
        throw new Error(response.message || 'Şifre sıfırlanırken bir hata oluştu');
      }

      return {
        success: true,
        message: response.message || 'Şifreniz başarıyla sıfırlandı.'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Şifre sıfırlanırken bir hata oluştu'
      };
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await api.user.updateProfile(data);

      if (response.status !== 'success') {
        throw new Error(response.message || 'Profil güncellenirken bir hata oluştu');
      }

      // Update user state with the returned data
      if (response.user) {
        setAuthState(prev => ({
          ...prev,
          user: {
            ...prev.user!,
            ...response.user
          }
        }));
      }

      return {
        success: true,
        message: response.message || 'Profil başarıyla güncellendi',
        requiresVerification: response.email_verification_required
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profil güncellenirken bir hata oluştu'
      };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await api.auth.changePassword(currentPassword, newPassword);

      if (response.status !== 'success') {
        throw new Error(response.message || 'Şifre değiştirilirken bir hata oluştu');
      }

      return {
        success: true,
        message: response.message || 'Şifre başarıyla değiştirildi'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Şifre değiştirilirken bir hata oluştu'
      };
    }
  };

  const verifyEmailChange = async (token: string, email: string) => {
    try {
      const response = await api.user.verifyEmailUpdate(token, email);

      if (response.status !== 'success') {
        throw new Error(response.message || 'E-posta doğrulanırken bir hata oluştu');
      }

      // Email changed successfully, update the user state
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? {
          ...prev.user,
          email: email
        } : null
      }));

      return {
        success: true,
        message: response.message || 'E-posta adresiniz başarıyla güncellendi'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'E-posta doğrulanırken bir hata oluştu'
      };
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
    verifyEmailChange
  };
};
