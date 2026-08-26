import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Faltan PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      flowType: "pkce",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
