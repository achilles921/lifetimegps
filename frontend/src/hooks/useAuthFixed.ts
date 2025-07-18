import { useState, useEffect, useCallback, useRef } from 'react';
import { getStoredAuth, setAuthInStorage, clearAuthFromStorage } from '@/lib/authUtils';
import { apiRequest } from '@/lib/queryClient';

// Simplified auth user interface
interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
}

export function useAuthFixed() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  // Storage key constants
  const STORAGE_KEYS = {
    IS_LOGGED_IN: 'isLoggedIn',
    USER_EMAIL: 'userEmail',
    USER_ID: 'userId',
    USER_NAME: 'userName'
  };

  // Helper function to safely access localStorage
  const getFromStorage = (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  // Helper function to safely set localStorage
  const setInStorage = (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  // Helper function to clear all auth data
  const clearStorage = (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear auth storage:', error);
    }
  };

  // Load user from storage on mount
  const loadUserFromStorage = useCallback((): void => {
    try {
      const authData = getStoredAuth();

      if (authData.isLoggedIn && authData.email && authData.userId && authData.userName) {
        setUser({
          id: authData.userId,
          email: authData.email,
          name: authData.userName
        });
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
    }
  }, []);

  // Save user data to storage
  const saveUserToStorage = useCallback((userData: AuthUser): void => {
    setAuthInStorage(userData);
  }, []);

  // Clear storage
  const clearStorage = useCallback((): void => {
    clearAuthFromStorage();
  }, []);

  // Login function
  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setLoginError(null);
    setIsLoading(true);

    try {

      // Try server login
      const response = await apiRequest('POST', '/api/auth/login', {
        username: credentials.email,
        password: credentials.password
      });

      if (response && response.id) {
        const userData: AuthUser = {
          id: response.id.toString(),
          email: response.email || credentials.email,
          name: response.firstName || credentials.email.split('@')[0],
          username: response.username || credentials.email
        };

        // Save to localStorage
        saveUserToStorage(userData);

        // Update state
        setUser(userData);

       //  console.log('Server login successful:', userData);

        return { success: true, user: userData };
      }

      const errorMsg = 'Invalid email or password';
      setLoginError(errorMsg);
      return { success: false, error: errorMsg };

    } catch (error: any) {
      console.error('Login error:', error);
      const errorMsg = error.message || 'Login failed';
      setLoginError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [saveUserToStorage]);

  // Logout function
  const logout = useCallback(() => {
    try {
      // Clear storage
      clearStorage();

      // Update state
      setUser(null);

      // Redirect to logout endpoint to clear server session
      window.location.href = '/api/logout';
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  // Clean up conflicting authentication data
  const cleanupConflictingAuth = useCallback((): void => {
    try {
      // Remove any conflicting keys from other auth systems
      const conflictingKeys = [
        'auth', 'user', 'localIsLoggedIn', 'userToken', 'sessionToken', 'authToken'
      ];

      conflictingKeys.forEach(key => {
        localStorage.removeItem(key);
      });

     //  console.log('Cleaned up conflicting authentication data');
    } catch (error) {
      console.error('Failed to cleanup conflicting auth data:', error);
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initializeAuth = async () => {
      // First clean up any conflicting data
      cleanupConflictingAuth();

      try {
        const storedUser = loadUserFromStorage();
        if (storedUser) {
          // For test accounts, trust local storage without server verification
          if (storedUser.email.includes('alainwin') || storedUser.email.includes('dlennox')) {
            setUser(storedUser);
           //  console.log('Authenticated test user from storage:', storedUser.email);
          } else {
            // For other accounts, verify with server
            try {
              const response = await apiRequest('GET', '/api/auth/user', undefined, {
                headers: {
                  'X-User-Email': storedUser.email,
                  'X-User-Id': storedUser.id
                }
              });

              if (response && response.id) {
                setUser(storedUser);
               //  console.log('Server authentication confirmed for:', storedUser.email);
              } else {
                clearStorage();
                setUser(null);
               //  console.log('Server authentication failed - cleared local state');
              }
            } catch (serverError) {
              // Maintain local auth for offline use
              setUser(storedUser);
             //  console.log('Auth check failed, maintaining local state for offline use');
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, [loadUserFromStorage, cleanupConflictingAuth]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    loginError
  };
}