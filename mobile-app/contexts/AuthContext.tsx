import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, User, setAccountStatusListener } from '../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<{ status: string; message?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  // Account status (for showing banned/pending screen globally)
  accountStatus: { type: 'banned' | 'pending'; message: string } | null;
  clearAccountStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountStatus, setAccountStatus] = useState<{ type: 'banned' | 'pending'; message: string } | null>(null);

  // Register the global listener for account status changes (fired by API interceptor)
  useEffect(() => {
    setAccountStatusListener((type, message) => {
      console.log('[AUTH] Account status changed:', type, message);
      setUser(null); // Force logout
      setAccountStatus({ type, message });
    });

    return () => {
      setAccountStatusListener(null);
    };
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      console.log('[AUTH] initAuth started');
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          console.log('[AUTH] Token found, getting profile...');
          const profile = await apiClient.getProfile();

          // Check if the user status is banned or pending
          if (profile.status === 'banned' || profile.status === 'pending') {
            console.log('[AUTH] User status is:', profile.status, '- clearing token');
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('user');
            setUser(null);
          } else {
            setUser(profile);
          }
        } else {
          console.log('[AUTH] No token stored.');
        }
      } catch (error: any) {
        console.error('[AUTH] initAuth error:', error.message);
        // If the interceptor already handled the ban, don't double-clear
        if (!accountStatus) {
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('user');
        }
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('[AUTH] Login called with:', email);
    const res = await apiClient.login(email, password);
    await AsyncStorage.setItem('access_token', res.access_token);

    const actualUser = res.user ? res.user : await apiClient.getProfile();
    setUser(actualUser);
    await AsyncStorage.setItem('user', JSON.stringify(actualUser));
  };

  const signup = async (data: any): Promise<{ status: string; message?: string }> => {
    console.log('[AUTH] Signup called for:', data.email);
    const res = await apiClient.signup(data);

    if (res.access_token) {
      await AsyncStorage.setItem('access_token', res.access_token);
      setUser(res.user);
      await AsyncStorage.setItem('user', JSON.stringify(res.user));
      return { status: res.user?.status || 'approved' };
    } else {
      return { status: res.status || 'pending', message: res.message };
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (e) {
      console.error('[AUTH] logout cleanup error:', e);
    }
    setUser(null);
  };

  const clearAccountStatus = () => {
    setAccountStatus(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, signup, logout,
      isAuthenticated: !!user,
      accountStatus, clearAccountStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be in AuthProvider');
  return context;
}
