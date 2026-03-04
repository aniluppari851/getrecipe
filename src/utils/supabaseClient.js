import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nysnycskfzjayafolrjw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55c255Y3NrZnpqYXlhZm9scmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMzA5MDIsImV4cCI6MjA4NzkwNjkwMn0.it8f3mgkiZuhzr3Cqa59VhSzMHBSIX6k8CeOdTW63X4';

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
