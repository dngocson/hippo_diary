import { createClient } from "@supabase/supabase-js";
import config from "@/app/config";

// Lấy Supabase config từ environment variables
const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.anonKey;

// Validate config
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "🚨 Supabase configuration missing! Please check your .env file:\n" +
      "  - EXPO_PUBLIC_SUPABASE_URL\n" +
      "  - EXPO_PUBLIC_SUPABASE_ANON_KEY",
  );
}

// Tạo Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Storage key cho AsyncStorage
    storageKey: "hippo-diary-auth",
    // Auto refresh token
    autoRefreshToken: true,
    // Persist session
    persistSession: true,
    // Detect session in URL (for OAuth redirects)
    detectSessionInUrl: false,
  },
});

export default supabase;
