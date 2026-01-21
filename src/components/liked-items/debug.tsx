import { useState, useEffect } from 'react';
import { LikedItemsService } from '@/lib/supabase/liked-items-service';
import { useAuth } from '@/contexts/AuthContext';

export function DebugLikedItems() {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<string>('');

  const testConnection = async () => {
    if (!user) {
      setTestResult('No user logged in');
      return;
    }

    try {
      // Test 1: Check if we can fetch liked items
      const result = await LikedItemsService.getLikedItems();
      setTestResult(`✅ Success: Found ${result.items.length} liked items`);
    } catch (error: any) {
      setTestResult(`❌ Error: ${error.message}`);
      console.error('Debug error:', error);
    }
  };

  const testLikeItem = async () => {
    if (!user) {
      setTestResult('No user logged in');
      return;
    }

    try {
      // Test 2: Try to like an item
      const result = await LikedItemsService.likeItem('product', 'test-123', {
        title: 'Test Product',
        price: 100,
        image: '/placeholder.svg',
        category: 'car',
        status: 'active'
      });
      setTestResult(`✅ Like test: ${result.success ? 'Success' : 'Failed'} - ${result.message}`);
    } catch (error: any) {
      setTestResult(`❌ Like error: ${error.message}`);
      console.error('Like error:', error);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Debug Liked Items</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            User: {user ? user.email : 'Not logged in'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={testConnection}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Connection
          </button>
          <button
            onClick={testLikeItem}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Like Item
          </button>
        </div>

        {testResult && (
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
