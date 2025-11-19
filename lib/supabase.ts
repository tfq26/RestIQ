import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Pull environment variables from app.json > extra
const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnon = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Secure check – never allow undefined env vars
if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    "Supabase environment variables are missing. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY."
  );
}

// Use recommended options for React Native
export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // RN apps don't need URL session detection
  },
});
