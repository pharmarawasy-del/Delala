import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Safety check to prevent crash if keys are missing
if (!supabaseUrl || !supabaseKey) {
    console.error("FATAL: Supabase keys are missing. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
