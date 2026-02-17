'use client';

import { useEffect, useCallback, useRef } from 'react';
import { createSupabaseBrowserClient } from '@/data/datasources/supabaseBrowser';
import { useAuthStore } from '@/presentation/stores/useAuthStore';

const supabase = createSupabaseBrowserClient();

export function useAuth() {
  const { user, session, loading, setSession, clearSession } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Immediately update the store so navigation doesn't race with onAuthStateChange
      if (data.session) setSession(data.session);
    },
    [setSession]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.session) setSession(data.session);
    },
    [setSession]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    clearSession();
  }, [clearSession]);

  return { user, session, loading, signIn, signUp, signOut };
}
