// useSimpleAuth.ts

import React, { useState, useEffect } from 'react';
import { getStoredAuth, setAuthInStorage, clearAuthFromStorage, loginWithBackend } from '@/lib/authUtils'; // Make sure setAuthInStorage is imported

interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string; // Add username if it's part of your user object
}

export function useSimpleAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const authData = getStoredAuth(); // This reads from localStorage (or whatever getStoredAuth does)

    if (authData.isLoggedIn && authData.email && authData.userId && authData.userName) {
      setUser({
        id: authData.userId,
        email: authData.email,
        name: authData.userName,
        username: authData.email // Assuming username is email, adjust if your backend provides a different one
      });
      console.log('Authenticated user loaded from storage:', authData.email);
    }
    setIsLoading(false);

    // Add event listener for cross-tab communication or localStorage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'isLoggedIn' && event.newValue === 'true') {
        const updatedAuthData = getStoredAuth();
        if (updatedAuthData.isLoggedIn && updatedAuthData.email && updatedAuthData.userId && updatedAuthData.userName) {
          setUser({
            id: updatedAuthData.userId,
            email: updatedAuthData.email,
            name: updatedAuthData.userName,
            username: updatedAuthData.email
          });
          console.log('Auth state updated from storage event.');
        }
      } else if (event.key === 'isLoggedIn' && event.newValue === null) {
        setUser(null);
        console.log('Auth state cleared from storage event.');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, []); // Empty dependency array means it runs once on mount

  const login = async (credentials: { email: string; password: string }) => {
    setLoginError(null);
    setIsLoading(true);

    try {
      const result = await loginWithBackend(credentials);

      if (result.success && result.user) {
        setUser(result.user);
        // ********************************************
        // CRITICAL FIX: PERSIST AUTH DATA TO LOCAL STORAGE
        setAuthInStorage({
          isLoggedIn: true,
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          authTimestamp: Date.now().toString(),
        });
        // ********************************************
        console.log('Backend login successful for:', result.user.email);
        setIsLoading(false);
        return { success: true, user: result.user };
      } else {
        setLoginError(result.error || 'Login failed');
        setIsLoading(false);
        // Clear auth on failed login attempt if any stale data exists
        clearAuthFromStorage();
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Login failed due to network error';
      setLoginError(errorMsg);
      setIsLoading(false);
      clearAuthFromStorage(); // Clear auth on error too
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    clearAuthFromStorage();
    setUser(null);
    // Redirecting to /api/logout usually means server-side session termination.
    // If your /api/logout also clears client-side cookies/localstorage, that's fine.
    // Otherwise, ensure clearAuthFromStorage fully removes client-side state.
    window.location.href = '/api/logout';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    loginError
  };
}