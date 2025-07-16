/**
 * Centralized authentication utilities to avoid inconsistencies
 */

import { apiRequest } from './queryClient';

// Core auth data interface
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

// Get consistent user ID for a given email (especially for test accounts)
export function getUserId(email: string | null | undefined): string {
  return getCookie('userId') || 'user-' + Math.floor(Math.random() * 10000);
}

// Generate a proper user name for an account
export function getUserName(email: string | null | undefined): string {
  if (!email) return 'Guest';

  // Default to capitalizing the part before @ and replacing dots with spaces
  return email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Cookie utility functions
function setCookie(name: string, value: string, days: number = 7): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
}

// Auth storage helpers
export interface AuthStorage {
  isLoggedIn: boolean;
  email: string;
  userId: string;
  userName: string;
}

// Get auth data from cookies
export function getAuthFromStorage(): AuthStorage {
  try {
    const isLoggedIn = getCookie('isLoggedIn') === 'true';
    const email = getCookie('userEmail') || '';
    const userId = getCookie('userId') || '';
    const userName = getCookie('userName') || '';

    return { isLoggedIn, email, userId, userName };
  } catch (error) {
    console.error('Failed to get auth data from cookies:', error);
    return { isLoggedIn: false, email: '', userId: '', userName: '' };
  }
}

export function getStoredAuth() {
  const isLoggedIn = getCookie('isLoggedIn') === 'true';
  const email = getCookie('userEmail') || '';
  const userId = getCookie('userId') || '';
  const userName = getCookie('userName') || '';

  return { isLoggedIn, email, userId, userName };
}

// Store auth data in cookies instead of localStorage
export function setAuthInStorage(user: AuthUser, sessionId?: string): void {
  try {
    setCookie('isLoggedIn', 'true');
    setCookie('userEmail', user.email);
    setCookie('userId', user.id);
    setCookie('userName', user.name);
    if (sessionId) {
      setCookie('sessionId', sessionId);
    }
  } catch (error) {
    console.error('Failed to save auth data to cookies:', error);
  }
}

export function clearAuthFromStorage(): void {
  try {
    deleteCookie('isLoggedIn');
    deleteCookie('userEmail');
    deleteCookie('userId');
    deleteCookie('userName');
    deleteCookie('sessionId');
  } catch (error) {
    console.error('Failed to clear auth data from cookies:', error);
  }
}

// Add auth headers to requests consistently
export function getAuthHeaders(email?: string): Record<string, string> {
  const authEmail = email || getCookie('userEmail') || '';

  if (!authEmail) {
    return {};
  }

  return {
    'X-User-Email': authEmail,
    'X-User-Id': getUserId(authEmail),
    'X-Auth-Token': `Bearer ${authEmail}`
  };
}

// Backend authentication functions
export async function loginWithBackend(credentials: { email: string; password: string }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const response = await apiRequest('POST', '/api/auth/login', {
      username: credentials.email,
      password: credentials.password
    }, {
      headers: {
        'X-User-Email': credentials.email,
        'X-Auth-Token': `Bearer ${credentials.email}`
      }
    });

    if (response && response.id) {
      const userData: AuthUser = {
        id: response.id.toString(),
        email: response.email || credentials.email,
        name: response.firstName || response.displayName || credentials.email.split('@')[0],
        username: response.username || credentials.email
      };

      // Store in cookies with session ID
      setAuthInStorage(userData, response.sessionId);

      return { success: true, user: userData };
    }

    return { success: false, error: 'Invalid response from server' };
  } catch (error: any) {
    console.error('Backend login error:', error);
    return { success: false, error: error.message || 'Login failed' };
  }
}

export async function signupWithBackend(signupData: {
  name: string;
  email: string;
  password: string;
  birthdate: string;
  parentName?: string;
  parentEmail?: string;
  parentConsent?: boolean;
}): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const response = await apiRequest('POST', '/api/auth/signup', {
      username: signupData.email,
      password: signupData.password,
      firstName: signupData.name.split(' ')[0] || signupData.name,
      lastName: signupData.name.split(' ').slice(1).join(' ') || '',
      birthdate: signupData.birthdate,
      parentName: signupData.parentName,
      parentEmail: signupData.parentEmail,
      parentConsent: signupData.parentConsent
    });

    if (response && response.id) {
      const userData: AuthUser = {
        id: response.id.toString(),
        email: response.email || signupData.email,
        name: response.firstName + (response.lastName ? ' ' + response.lastName : ''),
        username: response.username || signupData.email
      };

      // Store in cookies with session ID
      setAuthInStorage(userData, response.sessionId);

      return { success: true, user: userData };
    }

    return { success: false, error: 'Invalid response from server' };
  } catch (error: any) {
    console.error('Backend signup error:', error);
    return { success: false, error: error.message || 'Signup failed' };
  }
}