import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ppoygmaqlaiqcisjetea.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwb3lnbWFxbGFpcWNpc2pldGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTMyNDUsImV4cCI6MjA2OTk4OTI0NX0.UU6BxEDmme9Tamsts4EVSNfBSublO7aqO8zYojrrHhI';

export const supabase = createClient(supabaseUrl, supabaseKey);
