import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Створюємо клієнт тільки якщо змінні середовища встановлені
// Під час збірки може не бути змінних, тому не кидаємо помилку
let supabaseAdmin = null;

if (
  supabaseUrl &&
  supabaseServiceRoleKey &&
  supabaseServiceRoleKey !== 'your-service-role-key-here'
) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} else if (typeof window === 'undefined') {
  // Тільки на сервері показуємо попередження
  console.warn(
    'WARNING: SUPABASE_SERVICE_ROLE_KEY is not set correctly. Please update .env.local with the actual service role key from Supabase Dashboard.',
  );
}

export { supabaseAdmin };
