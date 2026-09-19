import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupportedStorage } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** False when the app hasn't been given Supabase credentials — see .env.example. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase is not configured (missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY). ' +
      'Falling back to local-only state — see .env.example to enable persistence.'
  );
}

/**
 * expo-router's web build server-renders every screen in Node, where
 * `window` doesn't exist. @react-native-async-storage/async-storage's
 * web fallback assumes it does and throws during that render, which
 * crashes the whole dev/build server the moment this client is
 * constructed (Supabase's auth client loads the persisted session
 * immediately, not lazily). Route web through a guarded wrapper around
 * window.localStorage that no-ops when there's no window; native
 * (iOS/Android) never runs in Node, so the real AsyncStorage is safe there.
 */
const webStorage: SupportedStorage = {
  getItem: async (key) => (typeof window === 'undefined' ? null : window.localStorage.getItem(key)),
  setItem: async (key, value) => {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key);
  },
};

const authStorage: SupportedStorage = Platform.OS === 'web' ? webStorage : AsyncStorage;

// createClient throws synchronously on an empty/invalid URL, so a
// missing config would crash app boot before isSupabaseConfigured is
// ever checked. Fall back to a syntactically-valid placeholder —
// isSupabaseConfigured gates every real call, so this client is
// constructed but never actually used when unconfigured.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      storage: authStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
