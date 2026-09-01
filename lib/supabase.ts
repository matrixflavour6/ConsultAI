import { createClient } from "@supabase/supabase-js";

// Server-side client using the service role key — only ever import this
// from API routes / server components, NEVER from client components.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// Browser client using the anon key — safe to use in client components,
// relies on Row Level Security to restrict access to the signed-in user.
export function supabaseBrowser() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
