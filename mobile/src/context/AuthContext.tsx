import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authService } from '../api/auth.service';
import { getErrorMessage } from '../api/client';
import { tokenStorage } from '../storage/tokenStorage';
import type { User } from '../types/api.types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bootstrap = useCallback(async () => {
    try {
      const accessToken = await tokenStorage.getAccessToken();
      const refreshToken = await tokenStorage.getRefreshToken();

      if (!accessToken && !refreshToken) return;

      if (refreshToken) {
        try {
          const data = await authService.refresh(refreshToken);
          await tokenStorage.setTokens(
            data.tokens.accessToken,
            data.tokens.refreshToken,
          );
          setUser(data.user);
          return;
        } catch {
          await tokenStorage.clearTokens();
        }
      }

      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch {
      await tokenStorage.clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const data = await authService.login(email, password);
      await tokenStorage.setTokens(
        data.tokens.accessToken,
        data.tokens.refreshToken,
      );
      setUser(data.user);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setError(null);
      try {
        const data = await authService.register(name, email, password);
        await tokenStorage.setTokens(
          data.tokens.accessToken,
          data.tokens.refreshToken,
        );
        setUser(data.user);
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        throw err;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    const refreshToken = await tokenStorage.getRefreshToken();
    try {
      await authService.logout(refreshToken ?? undefined);
    } finally {
      await tokenStorage.clearTokens();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      clearError: () => setError(null),
    }),
    [user, loading, error, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
