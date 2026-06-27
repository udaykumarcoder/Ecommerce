import { createClient } from '@supabase/supabase-js';
import { env } from './env';

export const hasSupabaseConfig = Boolean(env.supabaseUrl && env.supabasePublishableKey);

export const supabase = hasSupabaseConfig
  ? createClient(env.supabaseUrl!, env.supabasePublishableKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
