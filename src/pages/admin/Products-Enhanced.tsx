import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ProductForm from '@/components/Admin/ProductForm';
import { supabase } from '@/lib/supabase/client';
import AdminLayout from '@/components/Admin/AdminLayout';

interface Product {
  id: string;
  title: string;
  sku: string;
  brand: string;
  category: string;
  category_path: any;
  price: number;
  sale_price: number;
  stock: number;
  featured: boolean;
  is_active: boolean;
  created_at: string;
  product_media: Array<{
    id: string;
    url: string;
    type: 'image' | 'video';
    is_primary: boolean;
  }>;
}

export default function AdminProductsEnhanced() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_media(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('product_type, level, sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && product.is_active) ||
      (filterStatus === 'inactive' && !product.is_active) ||
      (filterStatus === 'featured' && product.featured);

    const matchesCategory = 
      filterCategory === 'all' ||
      product.category === filterCategory ||
      product.category_path?.product_type === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete product media first
      await supabase
        .from('product_media')
        .delete()
        .eq('product_id', productId);

      // Delete product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);

      if (error) throw error;

      await loadProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Failed to update product status');
    }
  };

  const toggleFeatured = async (productId: string, currentFeatured: boolean) => {
    try {
      // Try updating featured column first (this is the correct column name)
      const { error } = await supabase
        .from('products')
        .update({ featured: !currentFeatured })
        .eq('id', productId);

      if (error) {
        // If featured doesn't exist, try is_featured column
        const { error: fallbackError } = await supabase
          .from('products')
          .update({ is_featured: !currentFeatured })
          .eq('id', productId);
        
        if (fallbackError) throw fallbackError;
      }

      await loadProducts();
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Failed to update featured status');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPrimaryImage = (product: Product) => {
    const primaryImage = product.product_media.find(m => m.type === 'image' && m.is_primary);
    return primaryImage?.url || product.product_media.find(m => m.type === 'image')?.url;
  };

  const uniqueCategories = Array.from(new Set(products.map(p => p.category_path?.product_type || p.category))).filter(Boolean);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-10 animate-fade-in">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">📦 Product Management</h1>
                <p className="text-amber-100/90 text-lg">Manage your product catalog</p>
                <p className="text-amber-100/70 text-sm">Add, edit, and organize your automotive parts inventory with enhanced features</p>
              </div>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                ➕ Add Product
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Card className="shadow-md border-gray-200 dark:border-gray-700 animate-fade-in hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      placeholder="🔍 Search products by name, SKU, or brand..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                      <SelectValue placeholder="📋 Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">👥 All Status</SelectItem>
                      <SelectItem value="active">✅ Active</SelectItem>
                      <SelectItem value="inactive">❌ Inactive</SelectItem>
                      <SelectItem value="featured">⭐ Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-48">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                      <SelectValue placeholder="📂 Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">📂 All Categories</SelectItem>
                      {uniqueCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          📦 {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 animate-fade-in hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-3 rounded-xl">
                <span className="text-2xl">📦</span>
              </div>
              <div className="text-blue-600 dark:text-blue-400 text-sm font-semibold">Total</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Products</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{products.length}</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl shadow-md border border-green-200 dark:border-green-700/50 p-6 animate-fade-in hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-green-200 to-green-300 dark:from-green-600 dark:to-green-500 p-3 rounded-xl">
                <span className="text-2xl">✅</span>
              </div>
              <div className="text-green-600 dark:text-green-400 text-sm font-semibold">Active</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Products</div>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">
              {products.filter(p => p.is_active).length}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-2xl shadow-md border border-amber-200 dark:border-amber-700/50 p-6 animate-fade-in hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-600 dark:to-amber-500 p-3 rounded-xl">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="text-amber-600 dark:text-amber-400 text-sm font-semibold">Featured</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Featured Products</div>
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
              {products.filter(p => p.featured).length}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-2xl shadow-md border border-red-200 dark:border-red-700/50 p-6 animate-fade-in hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-red-200 to-red-300 dark:from-red-600 dark:to-red-500 p-3 rounded-xl">
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-red-600 dark:text-red-400 text-sm font-semibold">Low Stock</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Products (≤ 10)</div>
            <div className="text-3xl font-bold text-red-700 dark:text-red-300">
              {products.filter(p => p.stock <= 10).length}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <Card className="shadow-md border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              📋 Products ({filteredProducts.length})
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                Showing {filteredProducts.length} of {products.length} products
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">📦 Product</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">#️⃣ SKU</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">📂 Category</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">💰 Price</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">📊 Stock</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">📈 Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">⚡ Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-4xl mb-4">📦</div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {searchTerm || filterStatus !== 'all' || filterCategory !== 'all' 
                              ? 'No products found' 
                              : 'No products yet'}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md">
                            {searchTerm || filterStatus !== 'all' || filterCategory !== 'all' 
                              ? 'Try adjusting your search or filters to find what you\'re looking for.' 
                              : 'Get started by adding your first product to the catalog.'}
                          </p>
                          {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
                            <Button 
                              onClick={() => setShowAddModal(true)}
                              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Your First Product
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                              {getPrimaryImage(product) ? (
                                <img
                                  src={getPrimaryImage(product)}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <div className="text-2xl">📷</div>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 dark:text-white truncate">{product.title}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded font-mono">
                            {product.sku}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {product.category_path?.product_type || product.category || 'Uncategorized'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {formatCurrency(product.price)}
                            </div>
                            {product.sale_price && product.sale_price < product.price && (
                              <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
                                {formatCurrency(product.sale_price)}
                                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400 line-through">
                                  {formatCurrency(product.price)}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${
                              product.stock > 10 ? 'text-green-600 dark:text-green-400' : 
                              product.stock > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {product.stock}
                            </span>
                            {product.stock <= 10 && product.stock > 0 && (
                              <Badge variant="outline" className="text-xs border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300">
                                Low Stock
                              </Badge>
                            )}
                            {product.stock === 0 && (
                              <Badge variant="outline" className="text-xs border-red-300 dark:border-red-700 text-red-700 dark:text-red-300">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {product.featured && (
                              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 text-xs">
                                ⭐ Featured
                              </Badge>
                            )}
                            <Badge className={`text-xs ${
                              product.is_active 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {product.is_active ? '✅ Active' : '❌ Inactive'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => navigate(`/admin/products/${product.id}`)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditingProduct(product.id)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleProductStatus(product.id, product.is_active)}>
                                {product.is_active ? '❌ Deactivate' : '✅ Activate'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleFeatured(product.id, product.featured)}>
                                {product.featured ? '⭐ Remove from Featured' : '⭐ Make Featured'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Product
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add Product Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                🆕 Add New Product
              </DialogTitle>
            </DialogHeader>
            <ProductForm onSuccess={() => {
              setShowAddModal(false);
              loadProducts();
            }} />
          </DialogContent>
        </Dialog>

        {/* Edit Product Modal */}
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                ✏️ Edit Product
              </DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <ProductForm 
                productId={editingProduct} 
                onSuccess={() => {
                  setEditingProduct(null);
                  loadProducts();
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}