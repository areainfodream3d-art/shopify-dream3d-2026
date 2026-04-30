import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const createNoopSupabase = () => {
  const makeError = (message: string) => ({ message });

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
        error: null,
      }),
      signUp: async () => ({ data: { user: null, session: null }, error: makeError('Supabase non configurato') }),
      signInWithPassword: async () => ({ data: { session: null }, error: makeError('Supabase non configurato') }),
      resetPasswordForEmail: async () => ({ data: {}, error: makeError('Supabase non configurato') }),
      signOut: async () => ({ error: null }),
    },
  } as any;
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : createNoopSupabase();
