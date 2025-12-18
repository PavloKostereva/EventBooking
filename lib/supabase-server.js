import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase server environment variables');
}

if (supabaseServiceRoleKey === 'your-service-role-key-here') {
  console.warn(
    'WARNING: SUPABASE_SERVICE_ROLE_KEY is not set correctly. Please update .env.local with the actual service role key from Supabase Dashboard.',
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
