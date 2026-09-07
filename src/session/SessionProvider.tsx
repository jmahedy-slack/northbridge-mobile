import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { login, logout, restoreSession } from '../auth/sessionService';
import { SessionContext } from './SessionContext';
import type { Session } from '../types';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    restoreSession()
      .then((restored) => {
        if (!cancelled) setSession(restored);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    const next = await login(username, password);
    setSession(next);
  }, []);

  const signOut = useCallback(async () => {
    await logout();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, ready, signIn, signOut }),
    [session, ready, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
