// Fixed DashboardInventory Component (Uses RPC Functions)
// This replaces direct table queries with RPC functions to fix PGRST200 error

import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase/client'

interface PartnerProduct {
  id: string
  partner_id: string
  product_id: string
  custom_price?: number
  custom_description?: string
  is_active: boolean
  created_at: string
  updated_at: string
  product?: {
    id: string
    sku: string
    title: string
    description?: string
    category: string
    make: string
    model: string
    year?: number
    mileage?: number
    condition?: string
    original_price: number
    sale_price?: number
    stock_quantity: number
    is_active: boolean
    created_at: string
    updated_at: string
  }
}

export default function DashboardInventory({ partnerId }: { partnerId: string }) {
  const [inventory, setInventory] = useState<PartnerProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (partnerId) {
      loadInventory()
    }
  }, [partnerId])

  const loadInventory = async () => {
    if (!partnerId) return

    setLoading(true)
    setError('')

    try {
      console.log('Loading inventory for partner ID:', partnerId)
      
      // Use RPC function instead of direct table query
      const { data, error } = await supabase
        .rpc('get_partner_products', { p_partner_id: partnerId })

      if (error) {
        console.error('Inventory load error:', error)
        setError(error.message)
        setInventory([])
      } else {
        console.log('Inventory data loaded:', { count: data?.length || 0, data })
        setInventory(data || [])
      }
    } catch (err) {
      console.error('Unexpected error loading inventory:', err)
      setError('Failed to load inventory')
      setInventory([])
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getEffectivePrice = (item: PartnerProduct) => {
    return item.custom_price || item.product?.original_price || 0
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'text-red-600', text: 'Out of Stock' }
    if (stock < 5) return { color: 'text-yellow-600', text: 'Low Stock' }
    return { color: 'text-green-600', text: 'In Stock' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        <span className="ml-4 text-slate-600">Loading inventory...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Partner Inventory</h2>
        <p className="text-slate-600">Manage your product catalog and pricing</p>
      </div>

      {inventory.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <svg className="w-16 h-16 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H7a2 2 0 00-2 2v7a2 2 0 002 2h7a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v7a2 2 0 002 2h7a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3v4m0 4v-3m-6 3h6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Products Found</h3>
          <p className="text-slate-600">You haven't added any products to your inventory yet.</p>
          <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((item) => {
            const stockStatus = getStockStatus(item.product?.stock_quantity || 0)
            const effectivePrice = getEffectivePrice(item)
            
            return (
              <div key={item.id} className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                {/* Product Image Placeholder */}
                <div className="aspect-w-16 bg-slate-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 000 2.828 2.828l-8-8a2 2 0 000-2.828-2.828L4 16m0 0l8 8m0 0l-8-8" />
                  </svg>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
                      {item.product?.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-2 text-sm text-slate-600 mb-3">
                    <div className="flex justify-between">
                      <span>SKU:</span>
                      <span className="font-medium">{item.product?.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-medium">{item.product?.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Make:</span>
                      <span className="font-medium">{item.product?.make}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Model:</span>
                      <span className="font-medium">{item.product?.model}</span>
                    </div>
                    {item.product?.year && (
                      <div className="flex justify-between">
                        <span>Year:</span>
                        <span className="font-medium">{item.product.year}</span>
                      </div>
                    )}
                    {item.product?.mileage && item.product.mileage > 0 && (
                      <div className="flex justify-between">
                        <span>Mileage:</span>
                        <span className="font-medium">{item.product.mileage.toLocaleString()}</span>
                      </div>
                    )}
                    {item.product?.condition && (
                      <div className="flex justify-between">
                        <span>Condition:</span>
                        <span className="font-medium capitalize">{item.product.condition}</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          {formatCurrency(effectivePrice)}
                        </p>
                        {item.custom_price && item.custom_price !== item.product?.original_price && (
                          <p className="text-sm text-slate-500 line-through">
                            {formatCurrency(item.product.original_price || 0)}
                          </p>
                        )}
                      </div>
                      <div className={`text-right ${stockStatus.color}`}>
                        <p className="font-medium">{stockStatus.text}</p>
                        <p className="text-sm">
                          {item.product?.stock_quantity || 0} units
                        </p>
                      </div>
                    </div>

                    {/* Custom Description */}
                    {item.custom_description && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-md">
                        <p className="text-sm text-amber-800">
                          <strong>Partner Note:</strong> {item.custom_description}
                        </p>
                      </div>
                    )}

                    {/* Product Description */}
                    {item.product?.description && (
                      <div className="mt-3">
                        <p className="text-sm text-slate-600 line-clamp-3">
                          {item.product.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200">
                        Edit Price
                      </button>
                      <button className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200">
                        Edit Details
                      </button>
                    </div>
                    <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-amber-600">{inventory.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Active Products</h3>
          <p className="text-3xl font-bold text-green-600">
            {inventory.filter(item => item.is_active).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Total Value</h3>
          <p className="text-3xl font-bold text-slate-900">
            {formatCurrency(
              inventory.reduce((total, item) => {
                const price = getEffectivePrice(item)
                const stock = item.product?.stock_quantity || 0
                return total + (price * stock)
              }, 0)
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
