import { createClient } from "@supabase/supabase-js";
import config from "@/app/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
