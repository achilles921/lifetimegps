import React, { createContext, useContext, ReactNode } from 'react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  logout: () => void;
  loginError: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProviderFixed({ children }: { children: ReactNode }) {
  const auth = useSimpleAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}