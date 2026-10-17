import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Shyiramo URL na ANON_KEY zawe utoragura kuri Supabase Dashboard
const SUPABASE_URL = 'https://YOURhttps://ezgfnplbuuxfhimjwdbq.supabase.co/rest/v1/_SUPABASE_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'sb_secret_YT-49Hxw_4IBMWPvMVEF4Q_5AcSQdhceyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6Z2ZucGxidXV4ZmhpbWp3ZGJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNjc0NDIsImV4cCI6MjEwNzc0MzQ0Mn0.mP46VD8C9GyrqbsglLcdJHeg-Pt4UrhIXCgl1-0ED9Y';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});