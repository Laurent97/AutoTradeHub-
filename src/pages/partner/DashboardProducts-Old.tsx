import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase/client';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus, Edit, Trash2, Package, DollarSign, TrendingUp, Check, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  category: string;
  stock: number;
  image_url?: string;
  created_at: string;
  partner_id?: string;
}

interface PartnerProduct {
  id: string;
  product_id: string;
  partner_id: string;
  profit_margin: number;
  selling_price: number;
  is_active: boolean;
  created_at: string;
  product?: Product;
}

export default function DashboardProducts() {
  const { userProfile } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [partnerProducts, setPartnerProducts] = useState<PartnerProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [profitMargin, setProfitMargin] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadAllProducts();
    loadPartnerProducts();
  }, [userProfile]);

  const loadAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllProducts(data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadPartnerProducts = async () => {
    if (!userProfile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('partner_products')
        .select(`
          *,
          product:products(*)
        `)
        .eq('partner_id', userProfile.id);

      if (error) throw error;
      setPartnerProducts(data || []);
    } catch (err) {
      console.error('Failed to load partner products:', err);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedProduct || !userProfile?.id) return;

    try {
      const sellingPrice = selectedProduct.price * (1 + profitMargin / 100);
      
      const { error } = await supabase
        .from('partner_products')
        .insert({
          product_id: selectedProduct.id,
          partner_id: userProfile.id,
          profit_margin: profitMargin,
          selling_price: sellingPrice,
          is_active: true
        });

      if (error) throw error;

      setShowAddModal(false);
      setSelectedProduct(null);
      setProfitMargin(0);
      loadPartnerProducts();
      alert('Product added to your store successfully!');
    } catch (err) {
      console.error('Failed to add product:', err);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleUpdateProduct = async (partnerProductId: string, newMargin: number) => {
    if (!selectedProduct || !userProfile?.id) return;

    try {
      const sellingPrice = selectedProduct.price * (1 + newMargin / 100);
      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Failed to delete product:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Products</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold mb-4">Add New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="car">Car</option>
                <option value="part">Part</option>
                <option value="accessory">Accessory</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($)</label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Product description"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddProduct}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Save Product
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No products yet</p>
          <p className="text-sm text-gray-500">Add your first product to start selling</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cost</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Profit</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const profit = product.price - product.cost;
                const profitMargin = product.price > 0 ? (profit / product.price * 100).toFixed(1) : 0;
                return (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">${product.price?.toFixed(2)}</td>
                    <td className="px-6 py-4">${product.cost?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">${profit?.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{profitMargin}%</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:underline mr-4">Edit</button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
