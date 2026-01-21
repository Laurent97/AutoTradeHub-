import { useState } from 'react';
import { LikedItemsService } from '@/lib/supabase/liked-items-service';

export function ProductLikeDebug() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // Override the LikedItemsService temporarily for debugging
  const debugLikeItem = async (itemType: string, itemId: string, itemData: any) => {
    addLog(`🔍 Debug like attempt:`);
    addLog(`  - itemType: ${itemType}`);
    addLog(`  - itemId: ${itemId}`);
    addLog(`  - itemId type: ${typeof itemId}`);
    addLog(`  - itemData: ${JSON.stringify(itemData, null, 2)}`);

    try {
      addLog(`🚀 Calling LikedItemsService.likeItem...`);
      const result = await LikedItemsService.likeItem(itemType, itemId, itemData);
      addLog(`✅ Success: ${JSON.stringify(result, null, 2)}`);
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      addLog(`  - Code: ${error.code}`);
      addLog(`  - Details: ${error.details}`);
      addLog(`  - Hint: ${error.hint}`);
      console.error('Debug like error:', error);
    }
  };

  const testWithRealProductData = async () => {
    // Test with actual product data format
    const realProductData = {
      title: "2023 Toyota Land Cruiser",
      price: 78500,
      original_price: 85000,
      image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&auto=format&fit=crop",
      category: "car",
      make: "Toyota",
      model: "Land Cruiser",
      year: 2023,
      location: "Japan",
      condition: "Used",
      rating: 4.9,
    };

    await debugLikeItem('product', 'd821102-703f-467f-9a53-c15f56fdf1bd', realProductData);
  };

  const testWithUUID = async () => {
    // Test with a proper UUID format
    const testData = {
      title: "Test Product",
      price: 100,
      status: "active"
    };

    await debugLikeItem('product', '550e8400-e29b-41d4-a716-446655440000', testData);
  };

  const testWithStringId = async () => {
    // Test with string ID
    const testData = {
      title: "Test Product",
      price: 100,
      status: "active"
    };

    await debugLikeItem('product', 'product-123', testData);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold mb-4">Product Like Debug</h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={testWithRealProductData}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Test Real Product
        </button>
        <button
          onClick={testWithUUID}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          Test UUID ID
        </button>
        <button
          onClick={testWithStringId}
          className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
        >
          Test String ID
        </button>
        <button
          onClick={clearLogs}
          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
        >
          Clear
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`p-2 rounded text-sm font-mono ${
              log.includes('✅') ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
              log.includes('❌') ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200' :
              log.includes('🔍') || log.includes('🚀') ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
              'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {log}
          </div>
        ))}
      </div>

      {logs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Click the buttons above to debug product liking
        </div>
      )}
    </div>
  );
}
