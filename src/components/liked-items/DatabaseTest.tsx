import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function DatabaseTest() {
  const { user } = useAuth();
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBasicConnection = async () => {
    addResult('Testing basic Supabase connection...');
    try {
      const { data, error } = await supabase.from('products').select('count').single();
      if (error) {
        addResult(`❌ Basic connection failed: ${error.message}`);
      } else {
        addResult(`✅ Basic connection works: ${data?.count || 0} products found`);
      }
    } catch (err: any) {
      addResult(`❌ Basic connection error: ${err.message}`);
    }
  };

  const testLikedItemsTable = async () => {
    addResult('Testing liked_items table existence...');
    try {
      // Try to select from liked_items table
      const { data, error } = await supabase.from('liked_items').select('count').single();
      if (error) {
        addResult(`❌ liked_items table error: ${error.message}`);
        addResult(`💡 This likely means the table doesn't exist. Run the SQL migration script!`);
      } else {
        addResult(`✅ liked_items table exists: ${data?.count || 0} records found`);
      }
    } catch (err: any) {
      addResult(`❌ liked_items table error: ${err.message}`);
    }
  };

  const testRLS = async () => {
    if (!user) {
      addResult('❌ Cannot test RLS - no user logged in');
      return;
    }

    addResult('Testing RLS policies...');
    try {
      const { data, error } = await supabase
        .from('liked_items')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (error) {
        addResult(`❌ RLS test failed: ${error.message}`);
        addResult(`💡 Check if RLS policies are properly set up`);
      } else {
        addResult(`✅ RLS works: Found ${data?.length || 0} liked items for user`);
      }
    } catch (err: any) {
      addResult(`❌ RLS test error: ${err.message}`);
    }
  };

  const testInsert = async () => {
    if (!user) {
      addResult('❌ Cannot test insert - no user logged in');
      return;
    }

    addResult('Testing insert permission...');
    try {
      const { data, error } = await supabase
        .from('liked_items')
        .insert({
          user_id: user.id,
          item_id: 'test-123',
          item_type: 'product',
          item_data: {
            title: 'Test Product',
            price: 100,
            status: 'active'
          }
        })
        .select()
        .single();

      if (error) {
        addResult(`❌ Insert test failed: ${error.message}`);
        addResult(`💡 Check if INSERT RLS policy exists`);
      } else {
        addResult(`✅ Insert works: ${data?.id || 'unknown'}`);
      }
    } catch (err: any) {
      addResult(`❌ Insert test error: ${err.message}`);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Database Connection Test</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          User: {user ? user.email : 'Not logged in'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={testBasicConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Test Connection
        </button>
        <button
          onClick={testLikedItemsTable}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
        >
          Test Table
        </button>
        <button
          onClick={testRLS}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          Test RLS
        </button>
        <button
          onClick={testInsert}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
        >
          Test Insert
        </button>
        <button
          onClick={clearResults}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
        >
          Clear
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-2 rounded text-sm font-mono ${
              result.includes('✅') ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
              result.includes('❌') ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200' :
              result.includes('💡') ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200' :
              'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {result}
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Click the buttons above to test the database connection
        </div>
      )}
    </div>
  );
}
