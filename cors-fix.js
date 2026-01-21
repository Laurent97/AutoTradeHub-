// CORS Fix for Development
// This script helps resolve CORS issues during development

// 1. Make sure your Supabase project has CORS configured correctly
// 2. Use this script to test your configuration

const testCORS = async () => {
  try {
    const response = await fetch('https://coqjsxvjpgtolckepier.supabase.co/rest/v1/partner_profiles', {
      method: 'GET',
      headers: {
        'apikey': 'YOUR_SUPABASE_ANON_KEY',
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8081'
      }
    });
    
    if (response.ok) {
      console.log('✅ CORS is working correctly');
      const data = await response.json();
      console.log('Sample data:', data);
    } else {
      console.error('❌ CORS Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
  }
};

// Run this in browser console to test
testCORS();
