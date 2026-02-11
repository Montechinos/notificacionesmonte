import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { Database } from './types';

const getStorage = () => {
  if (Platform.OS !== 'web') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const SecureStore = require('expo-secure-store');
    return {
      getItem: (key: string) => SecureStore.getItemAsync(key),
      setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
      removeItem: (key: string) => SecureStore.deleteItemAsync(key),
    };
  }

  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) => { localStorage.setItem(key, value); return Promise.resolve(); },
      removeItem: (key: string) => { localStorage.removeItem(key); return Promise.resolve(); },
    };
  }

  // SSR / Node.js
  const mem = new Map<string, string>();
  return {
    getItem: (key: string) => Promise.resolve(mem.get(key) ?? null),
    setItem: (key: string, value: string) => { mem.set(key, value); return Promise.resolve(); },
    removeItem: (key: string) => { mem.delete(key); return Promise.resolve(); },
  };
};

// Singleton: evita instanciar múltiples clientes en hot reload
const globalKey = '__supabase_instance__';
type GlobalWithSupabase = typeof globalThis & { [globalKey]?: SupabaseClient<Database> };

const getSupabaseClient = (): SupabaseClient<Database> => {
  const g = globalThis as GlobalWithSupabase;
  if (g[globalKey]) return g[globalKey]!;

  g[globalKey] = createClient<Database>(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: getStorage(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    }
  );
  return g[globalKey]!;
};

export const supabase = getSupabaseClient();
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
