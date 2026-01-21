// Complete Product Management Component (100% Server Compatible)
// Uses RPC functions and comprehensive error handling

import React, { useState, useEffect } from 'react'
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  toggleProductStatus,
  searchProducts,
  validateProductData,
  formatPrice,
  generateSKU,
  type Product,
  type ProductFormData
} from '../services/productService'

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    sku: '',
    title: '',
    description: '',
    category: 'part',
    make: '',
    model: '',
    year: undefined,
    mileage: undefined,
    condition: '',
    original_price: 0,
    sale_price: undefined,
    stock_quantity: 0,
    is_active: true
  })
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  // Load products on component mount
  useEffect(() => {
    loadProducts()
  }, [])

  // Load all products
  const loadProducts = async () => {
    setLoading(true)
    try {
      const productsData = await getProducts({ isActive: true })
      setProducts(productsData)
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle search
  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.trim()) {
      const searchResults = await searchProducts(term)
      setProducts(searchResults)
    } else {
      loadProducts()
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data
    const validation = validateProductData(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    
    setSaving(true)
    setErrors([])

    try {
      if (editingProduct) {
        // Update existing product
        const updatedProduct = await updateProduct(editingProduct.id, formData)
        if (updatedProduct) {
          setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
          setShowAddModal(false)
          setEditingProduct(null)
          resetForm()
        }
      } else {
        // Create new product
        const newProduct = await createProduct(formData)
        if (newProduct) {
          setProducts([newProduct, ...products])
          setShowAddModal(false)
          resetForm()
        }
      }
    } catch (error) {
      console.error('Failed to save product:', error)
      setErrors(['Failed to save product. Please try again.'])
    } finally {
      setSaving(false)
    }
  }

  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const success = await deleteProduct(id)
      if (success) {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  // Handle product status toggle
  const handleToggleStatus = async (product: Product) => {
    try {
      const updatedProduct = await toggleProductStatus(product.id, product.is_active)
      if (updatedProduct) {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
      }
    } catch (error) {
      console.error('Failed to toggle product status:', error)
    }
  }

  // Handle edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      sku: product.sku,
      title: product.title,
      description: product.description || '',
      category: product.category,
      make: product.make || '',
      model: product.model || '',
      year: product.year,
      mileage: product.mileage,
      condition: product.condition || '',
      original_price: product.original_price,
      sale_price: product.sale_price,
      stock_quantity: product.stock_quantity,
      is_active: product.is_active
    })
    setShowAddModal(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      sku: '',
      title: '',
      description: '',
      category: 'part',
      make: '',
      model: '',
      year: undefined,
      mileage: undefined,
      condition: '',
      original_price: 0,
      sale_price: undefined,
      stock_quantity: 0,
      is_active: true
    })
    setErrors([])
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? Number(value) : undefined) : value
    }))
  }

  // Generate SKU automatically
  const generateAutoSKU = () => {
    const sku = generateSKU(formData.category, formData.make, formData.model)
    setFormData(prev => ({ ...prev, sku }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        <p className="ml-4 text-slate-600">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
            <button
              onClick={() => {
                resetForm()
                setShowAddModal(true)
                setEditingProduct(null)
              }}
              className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
            >
              Add Product
            </button>
          </div>
          
          {/* Search */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search products by title or SKU..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono bg-amber-100 px-2 py-1 rounded">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{product.title}</div>
                      <div className="text-sm text-slate-500">{product.make} {product.model}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{formatPrice(product.original_price)}</div>
                      {product.sale_price && (
                        <div className="text-sm text-green-600">{formatPrice(product.sale_price)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.stock_quantity > 10 
                          ? 'bg-green-100 text-green-800'
                          : product.stock_quantity > 5
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock_quantity} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={`px-3 py-1 text-xs rounded-full ${
                          product.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-amber-600 hover:text-amber-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              {/* Errors */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <ul className="text-red-800 text-sm">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">SKU</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Enter SKU"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateAutoSKU}
                      className="px-3 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter product title"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter product description"
                />
              </div>

              {/* Category and Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    title="Product Category"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="part">Part</option>
                    <option value="accessory">Accessory</option>
                    <option value="tool">Tool</option>
                    <option value="fluid">Fluid</option>
                    <option value="tire">Tire</option>
                    <option value="battery">Battery</option>
                    <option value="engine">Engine</option>
                    <option value="transmission">Transmission</option>
                    <option value="brake">Brake</option>
                    <option value="suspension">Suspension</option>
                    <option value="electrical">Electrical</option>
                    <option value="interior">Interior</option>
                    <option value="exterior">Exterior</option>
                    <option value="performance">Performance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Make</label>
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter make"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter model"
                  />
                </div>
              </div>

              {/* Year, Mileage, Condition */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter year"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mileage</label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter mileage"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    title="Product Condition"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="used">Used</option>
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Original Price</label>
                  <input
                    type="number"
                    name="original_price"
                    value={formData.original_price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter original price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sale Price</label>
                  <input
                    type="number"
                    name="sale_price"
                    value={formData.sale_price || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter sale price (optional)"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter stock quantity"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    name="is_active"
                    value={formData.is_active ? 'true' : 'false'}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                    title="Product Status"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingProduct(null)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
