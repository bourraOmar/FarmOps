import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, User } from '../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      console.log('[AUTH] initAuth started');
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          console.log('[AUTH] Token found, getting profile...');
          const profile = await apiClient.getProfile();
          setUser(profile);
        } else {
          console.log('[AUTH] No token stored.');
        }
      } catch (error: any) {
        console.error('[AUTH] initAuth error:', error.message);
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('user');
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

    // Some endpoints return user in login payload
    const actualUser = res.user ? res.user : await apiClient.getProfile();
    setUser(actualUser);
    await AsyncStorage.setItem('user', JSON.stringify(actualUser));
  };

  const signup = async (data: any) => {
    console.log('[AUTH] Signup called for:', data.email);
    const res = await apiClient.signup(data);
    await AsyncStorage.setItem('access_token', res.access_token);
    setUser(res.user);
    await AsyncStorage.setItem('user', JSON.stringify(res.user));
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (e) {
      console.error('[AUTH] logout cleanup error:', e);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be in AuthProvider');
  return context;
}
