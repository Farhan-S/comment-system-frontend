import axios from 'axios';
import React, { ReactNode, useEffect, useState } from 'react';
import { AuthContext, AuthContextType } from './AuthContextDefinition';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create a dedicated axios instance for auth with credentials enabled
const authApi = axios.create({
  baseURL: API_URL,
  withCredentials: true, // CRITICAL: Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      // Token is automatically sent via cookie (withCredentials: true)
      const response = await authApi.get('/api/auth/me');
      
      if (response.data.status === 'success' && response.data.data) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
        console.log('Auth check successful, user:', response.data.data.user);
      }
    } catch (error: unknown) {
      // Not authenticated or token expired
      const axiosError = error as { response?: { status?: number } };
      console.log('Not authenticated:', axiosError.response?.status);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting login with:', email);
      const response = await authApi.post('/api/auth/login', { email, password });

      console.log('Login response:', response.data);
      
      if (response.data.status === 'success' && response.data.data) {
        const { user } = response.data.data;
        
        // Token is now in HTTP-only cookie (set by backend)
        // No need to store it in localStorage
        
        setUser(user);
        setIsAuthenticated(true);
        console.log('Login successful, user:', user);
        console.log('Token stored in HTTP-only cookie by backend');
      } else {
        throw new Error('Login failed');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || 'Login failed';
      setError(errorMessage);
      console.error('Login error:', errorMessage, axiosError.response);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting registration with:', email);
      const response = await authApi.post('/api/auth/register', { name, email, password });

      console.log('Registration response:', response.data);
      
      if (response.data.status === 'success' && response.data.data) {
        const { user } = response.data.data;
        
        // Token is now in HTTP-only cookie (set by backend)
        // No need to store it in localStorage
        
        setUser(user);
        setIsAuthenticated(true);
        console.log('Registration successful, user:', user);
        console.log('Token stored in HTTP-only cookie by backend');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      console.error('Registration error:', errorMessage, axiosError.response);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to clear HTTP-only cookie
      await authApi.post('/api/auth/logout');
      console.log('Logout successful - cookie cleared by backend');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
