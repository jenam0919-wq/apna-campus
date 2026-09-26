/**
 * Campus 360 - Production Authentication Context & RBAC Provider
 * "One Campus. Everything Connected."
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  UserAccount,
  UserRole,
  Permission,
  ROLE_PERMISSIONS,
  AuthContextType,
} from '../types/auth';
import {
  CampusAPI,
  getAuthToken,
  setAuthToken,
  getStoredUser,
  setStoredUser,
  clearAuthSession,
} from '../services/api';
import { firebaseSignOut } from '../services/firebase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function getRoleDashboardPath(role: UserRole): string {
  switch (role) {
    case 'Student':
      return '/student/dashboard';
    case 'Faculty':
      return '/faculty/dashboard';
    case 'Admin':
      return '/admin/dashboard';
    case 'Warden':
      return '/warden/dashboard';
    case 'Staff':
      return '/staff/dashboard';
    default:
      return '/student/dashboard';
  }
}

export function isPathAllowedForRole(pathname: string, role: UserRole): boolean {
  if (pathname === '/login' || pathname === '/') return true;

  if (pathname.startsWith('/admin')) {
    return role === 'Admin';
  }
  if (pathname.startsWith('/faculty')) {
    return role === 'Faculty';
  }
  if (pathname.startsWith('/warden')) {
    return role === 'Warden';
  }
  if (pathname.startsWith('/staff')) {
    return role === 'Staff';
  }
  if (pathname.startsWith('/student')) {
    return role === 'Student';
  }

  return true;
}

export function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith('/student') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/faculty') ||
    pathname.startsWith('/warden') ||
    pathname.startsWith('/staff')
  );
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getStoredUser());
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/login';
    }
    return '/login';
  });

  // Client-side router navigation helper
  const navigate = useCallback((path: string, options?: { replace?: boolean }) => {
    if (typeof window === 'undefined') return;

    if (options?.replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
  }, []);

  // Listen to browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/login');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Startup session verification
  const verifySessionOnStartup = useCallback(async () => {
    setLoading(true);
    const token = getAuthToken();
    const cachedUser = getStoredUser();

    if (!token && !cachedUser) {
      setLoading(false);
      // If user landed on a protected path without session, route to /login
      if (isProtectedPath(window.location.pathname)) {
        navigate('/login', { replace: true });
      }
      return;
    }

    try {
      const res = await CampusAPI.me();
      if (res.data?.user) {
        const validatedUser = res.data.user;
        setCurrentUser(validatedUser);
        setStoredUser(validatedUser);

        // Check if on login or root: redirect to role dashboard
        const current = window.location.pathname;
        if (current === '/login' || current === '/') {
          navigate(getRoleDashboardPath(validatedUser.role), { replace: true });
        }
      } else {
        // Session invalid or expired: clear state and route to login
        clearAuthSession();
        setCurrentUser(null);
        if (isProtectedPath(window.location.pathname)) {
          navigate('/login', { replace: true });
        }
      }
    } catch {
      // Offline fallback: if cached user exists, keep it
      if (cachedUser) {
        setCurrentUser(cachedUser);
      } else {
        clearAuthSession();
        setCurrentUser(null);
        if (isProtectedPath(window.location.pathname)) {
          navigate('/login', { replace: true });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    verifySessionOnStartup();
  }, [verifySessionOnStartup]);

  // Refresh current user
  const refreshUser = useCallback(async (): Promise<UserAccount | null> => {
    try {
      const res = await CampusAPI.me();
      if (res.data?.user) {
        setCurrentUser(res.data.user);
        setStoredUser(res.data.user);
        return res.data.user;
      }
    } catch {
      //
    }
    return currentUser;
  }, [currentUser]);

  // Login handler
  const login = useCallback(
    async (
      emailOrId: string,
      password: string,
      rememberMe: boolean = true
    ): Promise<{
      success: boolean;
      error?: string;
      status?: 'invalid' | 'disabled' | 'network_error' | 'success';
      user?: UserAccount;
    }> => {
      try {
        const res = await CampusAPI.login(emailOrId, password, rememberMe);

        if (res.error) {
          if (res.status === 403) {
            return {
              success: false,
              error: res.error,
              status: 'disabled',
            };
          }
          if (res.status === 0) {
            return {
              success: false,
              error: res.error || 'Network error: could not connect to server.',
              status: 'network_error',
            };
          }
          return {
            success: false,
            error: res.error || 'Invalid credentials.',
            status: 'invalid',
          };
        }

        if (res.data?.token && res.data?.user) {
          const { token, user } = res.data;
          setAuthToken(token, rememberMe);
          setStoredUser(user, rememberMe);
          setCurrentUser(user);

          return {
            success: true,
            status: 'success',
            user,
          };
        }

        return {
          success: false,
          error: 'Authentication failed. Please verify credentials.',
          status: 'invalid',
        };
      } catch (err: any) {
        return {
          success: false,
          error: 'Connection error. Please check your network.',
          status: 'network_error',
        };
      }
    },
    []
  );

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await Promise.allSettled([
        CampusAPI.logout(),
        firebaseSignOut(),
      ]);
    } catch {
      //
    } finally {
      clearAuthSession();
      setCurrentUser(null);
      // Invalidate URL history replace to prevent back button from accessing dashboard
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Role verification helper
  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!currentUser) return false;
      const targetRoles = Array.isArray(roles) ? roles : [roles];
      return targetRoles.includes(currentUser.role);
    },
    [currentUser]
  );

  // Granular permission verification helper
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!currentUser) return false;
      const allowed = ROLE_PERMISSIONS[currentUser.role] || [];
      return allowed.includes(permission);
    },
    [currentUser]
  );

  const value: AuthContextType = {
    currentUser,
    role: currentUser ? currentUser.role : null,
    isAuthenticated: !!currentUser,
    loading,
    currentPath,
    navigate,
    login,
    logout,
    refreshUser,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
