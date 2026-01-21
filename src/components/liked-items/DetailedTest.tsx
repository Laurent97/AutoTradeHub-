import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function DetailedTest() {
  const { user } = useAuth();
  const [result, setResult] = useState('');

  const testInsertDetailed = async () => {
    if (!user) {
      setResult('❌ No user logged in');
      return;
    }

    try {
      console.log('Testing insert with user:', user.id);
      
      // Test 1: Simple insert with minimal data
      const testData = {
        user_id: user.id,
        item_id: 'test-simple-123',
        item_type: 'product',
        item_data: {
          title: 'Test Product',
          price: 100,
          status: 'active'
        }
      };

      console.log('Insert data:', testData);

      const { data, error, status } = await supabase
        .from('liked_items')
        .insert(testData)
        .select()
        .single();

      console.log('Insert result:', { data, error, status });

      if (error) {
        setResult(`❌ Insert failed: ${error.message}\nCode: ${error.code}\nDetails: ${error.details}\nHint: ${error.hint}`);
      } else if (data) {
        setResult(`✅ Insert successful!\nID: ${data.id}\nUser: ${data.user_id}\nItem: ${data.item_id}`);
      } else {
        setResult(`❌ No data returned, status: ${status}`);
      }
    } catch (err: any) {
      console.error('Insert error:', err);
      setResult(`❌ Exception: ${err.message}`);
    }
  };

  const testSelect = async () => {
    if (!user) {
      setResult('❌ No user logged in');
      return;
    }

    try {
      console.log('Testing select with user:', user.id);

      const { data, error } = await supabase
        .from('liked_items')
        .select('*')
        .eq('user_id', user.id);

      console.log('Select result:', { data, error });

      if (error) {
        setResult(`❌ Select failed: ${error.message}\nCode: ${error.code}`);
      } else {
        setResult(`✅ Select successful!\nFound ${data?.length || 0} items\nItems: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err: any) {
      console.error('Select error:', err);
      setResult(`❌ Exception: ${err.message}`);
    }
  };

  const testRawQuery = async () => {
    if (!user) {
      setResult('❌ No user logged in');
      return;
    }

    try {
      // Test the exact query that's failing
      const { data, error } = await supabase
        .from('liked_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('item_id', 'd437c33e-5391-469d-9b9d-1f99ab3325a7')
        .eq('item_type', 'product');

      console.log('Raw query result:', { data, error });

      if (error) {
        setResult(`❌ Raw query failed: ${error.message}\nCode: ${error.code}\nDetails: ${error.details}`);
      } else {
        setResult(`✅ Raw query successful!\nFound ${data?.length || 0} items`);
      }
    } catch (err: any) {
      console.error('Raw query error:', err);
      setResult(`❌ Exception: ${err.message}`);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold mb-4">Detailed Database Test</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          User: {user ? user.email : 'Not logged in'}
          {user && <br />}
          User ID: {user?.id}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={testInsertDetailed}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Test Insert
        </button>
        <button
          onClick={testSelect}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          Test Select
        </button>
        <button
          onClick={testRawQuery}
          className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
        >
          Test Raw Query
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
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
