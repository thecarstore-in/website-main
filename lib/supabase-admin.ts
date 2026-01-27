import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey
);

export function isValidAdminKey(apiKey: string | null | undefined): boolean {
  if (!apiKey) return false;
  
  // Support multiple keys (one per admin/client)
  const validKeys = process.env.ADMIN_API_KEYS?.split(',').map(k => k.trim()) || [];
  return validKeys.includes(apiKey);
}