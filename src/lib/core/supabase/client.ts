import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { Database } from './types';

// Importación condicional: SecureStore solo existe en entornos nativos
const getStorage = () => {
  // Nativo (iOS / Android)
  if (Platform.OS !== 'web') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const SecureStore = require('expo-secure-store');
    return {
      getItem: (key: string) => SecureStore.getItemAsync(key),
      setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
      removeItem: (key: string) => SecureStore.deleteItemAsync(key),
    };
  }

  // Web en browser (localStorage disponible)
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) => {
        localStorage.setItem(key, value);
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        localStorage.removeItem(key);
        return Promise.resolve();
      },
    };
  }

  // SSR / Node.js (pre-render de Expo Router) — sin persistencia
  const memoryStorage = new Map<string, string>();
  return {
    getItem: (key: string) => Promise.resolve(memoryStorage.get(key) ?? null),
    setItem: (key: string, value: string) => {
      memoryStorage.set(key, value);
      return Promise.resolve();
    },
    removeItem: (key: string) => {
      memoryStorage.delete(key);
      return Promise.resolve();
    },
  };
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
