// Quick script to update user to admin
// Run this in your browser console when logged in as admin

import { supabase } from './src/lib/supabase/client';

async function makeUserAdmin() {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ user_type: 'admin' })
      .eq('email', 'kizzolaurent@gmail.com')
      .select();
    
    if (error) {
      console.error('Error updating user:', error);
    } else {
      console.log('User updated to admin:', data);
      console.log('Please refresh the page to see changes');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Run the function
makeUserAdmin();
