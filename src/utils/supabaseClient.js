import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://coqhlkczhgskouiwkzvu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvcWhsa2N6aGdza291aXdrenZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNzc3MjMsImV4cCI6MjA4MTk1MzcyM30.NyINPOADHviSHlNQUJ_-0BOizSat1RFES0QjJj_s3PQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Utility to generate a unique guest ID and store it locally
export const getMyGuestId = () => {
    let guestId = localStorage.getItem('tryrecipe_guest_id');
    if (!guestId) {
        // Generate a simple random ID for the device
        guestId = 'guest_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('tryrecipe_guest_id', guestId);
    }
    return guestId;
};
