import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { UNAUTHORIZED_EVENT } from '../services/api';
import { authService } from '../services/authService';
import { clearToken, getToken, setToken } from '../services/tokenStorage';
import { DEFAULT_CURRENCY, DEFAULT_PREFERENCES } from '../utils/constants';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(getToken() ? 'loading' : 'unauthenticated');

  // Restore the session from a stored token.
  useEffect(() => {
    if (!getToken()) return undefined;
    let cancelled = false;
    authService
      .getCurrentUser()
      .then((currentUser) => {
        if (cancelled) return;
        setUser(currentUser);
        setStatus('authenticated');
      })
      .catch(() => {
        if (cancelled) return;
        clearToken();
        setStatus('unauthenticated');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // The API layer fires this when any request returns 401.
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setStatus('unauthenticated');
    };
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const startSession = useCallback(({ token, user: nextUser }, remember) => {
    setToken(token, remember);
    setUser(nextUser);
    setStatus('authenticated');
    return nextUser;
  }, []);

  const login = useCallback(
    async ({ email, password, remember = true }) => startSession(await authService.login({ email, password }), remember),
    [startSession],
  );

  const register = useCallback(
    async (payload) => startSession(await authService.register(payload), true),
    [startSession],
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const updated = await authService.updateProfile(payload);
    setUser(updated);
    return updated;
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      initializing: status === 'loading',
      isAuthenticated: status === 'authenticated',
      preferences: { ...DEFAULT_PREFERENCES, ...user?.preferences },
      currency: user?.preferences?.currency || DEFAULT_CURRENCY,
      login,
      register,
      logout,
      updateProfile,
      forgotPassword: authService.forgotPassword,
      changePassword: authService.changePassword,
    }),
    [user, status, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
