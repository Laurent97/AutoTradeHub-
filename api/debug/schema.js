export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
    );

    // Get table structure
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.columns')
      .select('table_name, column_name, data_type')
      .eq('table_schema', 'public')
      .in('table_name', ['products', 'orders', 'users', 'partner_profiles', 'order_items'])
      .order('table_name, ordinal_position');

    if (tablesError) {
      throw tablesError;
    }

    // Group by table
    const schema = {};
    tables.forEach(col => {
      if (!schema[col.table_name]) {
        schema[col.table_name] = [];
      }
      schema[col.table_name].push({
        column: col.column_name,
        type: col.data_type
      });
    });

    // Get sample data from products table
    const { data: sampleProducts, error: sampleError } = await supabase
      .from('products')
      .select('*')
      .limit(3);

    return res.status(200).json({
      schema,
      sampleProducts: sampleProducts || [],
      sampleError: sampleError?.message
    });

  } catch (error) {
    console.error('Schema debug error:', error);
    return res.status(500).json({ error: error.message });
  }
}
