import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function SimpleTest() {
  const { user } = useAuth();
  const [result, setResult] = useState('');

  const testTable = async () => {
    try {
      // Test if table exists by trying to describe it
      const { data, error } = await supabase.rpc('get_table_definition', {
        table_name: 'liked_items'
      });
      
      if (error) {
        setResult(`❌ Table doesn't exist: ${error.message}`);
      } else {
        setResult(`✅ Table exists: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err: any) {
      setResult(`❌ Error: ${err.message}`);
    }
  };

  const testRLS = async () => {
    if (!user) {
      setResult('❌ No user logged in');
      return;
    }

    try {
      // Test RLS by trying to access user's liked items
      const { data, error } = await supabase
        .from('liked_items')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (error) {
        setResult(`❌ RLS failed: ${error.message}`);
      } else {
        setResult(`✅ RLS works: Found ${data.length} items`);
      }
    } catch (err: any) {
      setResult(`❌ RLS error: ${err.message}`);
    }
  };

  const testInsert = async () => {
    if (!user) {
      setResult('❌ No user logged in');
      return;
    }

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
        });

      if (error) {
        setResult(`❌ Insert failed: ${error.message}`);
      } else {
        setResult(`✅ Insert successful: ${data[0]?.id}`);
      }
    } catch (err: any) {
      setResult(`❌ Insert error: ${err.message}`);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold mb-4">Simple Database Test</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          User: {user ? user.email : 'Not logged in'}
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={testTable}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Test Table
        </button>
        <button
          onClick={testRLS}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          Test RLS
        </button>
        <button
          onClick={testInsert}
          className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
        >
          Test Insert
        </button>
        <button
          onClick={() => setResult('')}
          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
        >
          Clear
        </button>
      </div>

      {result && (
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
          <pre className="text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
}
