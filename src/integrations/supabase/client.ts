// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xhayazqhjfnvusnbjwek.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoYXlhenFoamZudnVzbmJqd2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MTQ4NTYsImV4cCI6MjA0ODQ5MDg1Nn0.SLxJL4MLeZVlk4D6xISiF8yEXtigRvS5fzVORPBZTSY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);