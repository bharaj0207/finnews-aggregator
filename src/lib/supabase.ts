import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.");
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL.trim(),
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim()
);

// Admin client to bypass RLS for server-side operations (like the cron job)
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL.trim(),
      process.env.SUPABASE_SERVICE_ROLE_KEY.trim()
    )
  : supabase; // Fallback to anon client if not provided, though it will fail RLS
