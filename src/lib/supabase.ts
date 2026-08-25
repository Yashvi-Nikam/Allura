import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ HARDCODED VALUES - These MUST be here for the production APK to work!
const supabaseUrl  = 'https://yqngnnwkoejjccsnuodh.supabase.co';
const supabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxbmdubndrb2VqamNjc251b2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NjMxMDYsImV4cCI6MjEwMzAzOTEwNn0.3RYsatql3J7NckZabWdz_FM_vrOwQHDfGe8YH9xOmoA';

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});