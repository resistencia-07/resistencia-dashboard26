import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getStoredSession, loginWithUsername, logoutUser } from '../lib/authService';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const existing = getStoredSession();
    if (existing) {
      setUser({
        id: 'admin',
        username: existing.username,
        role: 'admin',
        user_metadata: {
          username: existing.username,
          name: 'Admin',
        },
      });
      setSession(existing);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    const result = await loginWithUsername(username, password);

    if (result.success) {
      setUser(result.user);
      setSession(result.session);
    }

    return result;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, session, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
