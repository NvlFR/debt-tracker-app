// src/config/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Ganti nilai-nilai berikut dengan URL dan kunci Anda dari Supabase
const supabaseUrl = 'https://cswrqwpmihwgvrrzedwg.supabase.co'; // Sudah benar
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzd3Jxd3BtaWh3Z3ZycnplZHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTYxNjYsImV4cCI6MjA2ODQ5MjE2Nn0.B1sUI5Q5gRSoVNW-L0FI4xckYR30AqEmu5zmahJT5pY'; // Placeholder sudah dihapus

export const supabase = createClient(supabaseUrl, supabaseAnonKey);