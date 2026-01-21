import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function LiveDebug() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);
  const [realTimeItems, setRealTimeItems] = useState<any[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // Monitor liked items in real-time
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('liked_items_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'liked_items', filter: `user_id=eq.${user.id}` },
        (payload) => {
          addLog(`🔄 Real-time change: ${payload.eventType}`);
          addLog(`  - Payload: ${JSON.stringify(payload, null, 2)}`);
          
          // Refresh the items list
          fetchLikedItems();
        }
      )
      .subscribe();

    // Initial fetch
    fetchLikedItems();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchLikedItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('liked_items')
        .select('*')
        .eq('user_id', user.id)
        .order('liked_at', { ascending: false });

      if (error) {
        addLog(`❌ Fetch error: ${error.message}`);
      } else {
        setRealTimeItems(data || []);
        addLog(`📊 Found ${data?.length || 0} items`);
        data?.forEach((item, index) => {
          addLog(`  ${index + 1}. ${item.item_data?.title || 'No title'} (${item.item_id})`);
        });
      }
    } catch (err: any) {
      addLog(`❌ Fetch exception: ${err.message}`);
    }
  };

  const clearAll = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('liked_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        addLog(`❌ Clear error: ${error.message}`);
      } else {
        addLog(`✅ All liked items cleared`);
        setRealTimeItems([]);
      }
    } catch (err: any) {
      addLog(`❌ Clear exception: ${err.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold mb-4">Live Debug Monitor</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          User: {user ? user.email : 'Not logged in'}
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={fetchLikedItems}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Refresh
        </button>
        <button
          onClick={clearAll}
          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          Clear All
        </button>
        <button
          onClick={clearLogs}
          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
        >
          Clear Logs
        </button>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Current Liked Items ({realTimeItems.length}):</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {realTimeItems.map((item, index) => (
            <div key={item.id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
              <div className="font-medium">{item.item_data?.title || 'No title'}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                ID: {item.item_id} | Type: {item.item_type}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`p-2 rounded text-sm font-mono ${
              log.includes('✅') ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
              log.includes('❌') ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200' :
              log.includes('🔄') ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
              log.includes('📊') ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200' :
              'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {log}
          </div>
        ))}
      </div>

      {logs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Try liking a product to see real-time debug info
        </div>
      )}
    </div>
  );
}
