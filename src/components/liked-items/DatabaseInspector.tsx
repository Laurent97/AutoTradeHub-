import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function DatabaseInspector() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const inspectDatabase = async () => {
    addLog('🔍 Inspecting database structure...');
    
    try {
      // Check products table structure
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, title, category, category_path, created_at')
        .limit(10);

      if (productsError) {
        addLog(`❌ Products error: ${productsError.message}`);
      } else {
        addLog(`📊 Found ${productsData?.length || 0} products`);
        productsData?.forEach((product, index) => {
          addLog(`  ${index + 1}. ${product.title}`);
          addLog(`     - category: ${product.category}`);
          addLog(`     - category_path: ${JSON.stringify(product.category_path)}`);
        });
        setProducts(productsData || []);
      }

      // Check product_categories table
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('product_categories')
        .select('*')
        .limit(20);

      if (categoriesError) {
        addLog(`❌ Categories error: ${categoriesError.message}`);
      } else {
        addLog(`📂 Found ${categoriesData?.length || 0} categories`);
        categoriesData?.forEach((cat, index) => {
          addLog(`  ${index + 1}. ${cat.product_type} - ${cat.category_name} (level ${cat.level})`);
        });
        setCategories(categoriesData || []);
      }

      // Show unique category values from products
      const uniqueCategories = [...new Set(productsData?.map(p => p.category) || [])];
      addLog(`📋 Unique product categories: ${uniqueCategories.join(', ')}`);

    } catch (err: any) {
      addLog(`❌ Inspection error: ${err.message}`);
    }
  };

  const updateProductCategories = async () => {
    if (!user || user.user_type !== 'admin') {
      addLog('❌ Admin access required for database updates');
      return;
    }

    addLog('🔧 Updating product categories...');
    
    try {
      // Update products to match expected category_path structure
      const updates = products.map(product => {
        let category_path = product.category_path;
        
        // If category_path is null or missing, create it based on category
        if (!category_path) {
          switch (product.category) {
            case 'car':
              category_path = { product_type: 'cars', category_name: 'Cars', level: 1 };
              break;
            case 'part':
              category_path = { product_type: 'parts', category_name: 'Parts', level: 1 };
              break;
            case 'accessory':
              category_path = { product_type: 'accessories', category_name: 'Accessories', level: 1 };
              break;
            default:
              category_path = { product_type: product.category || 'other', category_name: 'Other', level: 1 };
          }
        }
        
        return { id: product.id, category_path };
      });

      // Update products in batches
      for (let i = 0; i < updates.length; i += 5) {
        const batch = updates.slice(i, i + 5);
        const { error } = await supabase
          .from('products')
          .upsert(batch);
        
        if (error) {
          addLog(`❌ Batch ${i + 1}-${Math.min(i + 5, updates.length)} error: ${error.message}`);
        } else {
          addLog(`✅ Batch ${i + 1}-${Math.min(i + 5, updates.length)} updated successfully`);
        }
      }

      addLog(`✅ Updated ${updates.length} products with category_path`);
      
      // Refresh the data
      await inspectDatabase();
      
    } catch (err: any) {
      addLog(`❌ Update error: ${err.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold mb-4">Database Inspector</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          User: {user ? user.email : 'Not logged in'} ({user?.user_type})
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={inspectDatabase}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Inspect Database
        </button>
        <button
          onClick={updateProductCategories}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          Fix Categories
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
              log.includes('🔍') || log.includes('📊') || log.includes('📋') || log.includes('🔧') ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
              'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {log}
          </div>
        ))}
      </div>

      {logs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Click "Inspect Database" to see the current state
        </div>
      )}
    </div>
  );
}
