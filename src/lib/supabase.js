import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

const missingVariables = [
  !supabaseUrl && 'VITE_SUPABASE_URL',
  !supabaseKey && 'VITE_SUPABASE_PUBLISHABLE_KEY',
].filter(Boolean);

/**
 * Kept as a value instead of throwing at import time. A top-level throw makes
 * the whole bundle fail to evaluate, which shows up as a blank white page on
 * hosted deployments where the environment variables were not configured.
 */
export const supabaseConfigError = missingVariables.length
  ? `Missing environment variable${missingVariables.length > 1 ? 's' : ''}: ${missingVariables.join(', ')}.`
  : null;

export const supabase = supabaseConfigError
  ? null
  : createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
    });

export const getSupabaseConfig = () => ({
  url: supabaseUrl,
  hasKey: Boolean(supabaseKey),
});
