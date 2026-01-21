// Fixed Product Service (Uses RPC Functions Only)
// This replaces all direct table queries with RPC functions

import { supabase } from '../lib/supabase/client'

// Product interface matching the database
export interface Product {
  id: string
  sku: string
  title: string
  description?: string
  category: string
  make: string          // Correct column name (not 'brand')
  model: string
  year?: number
  mileage?: number
  condition?: string
  original_price: number
  sale_price?: number
  stock_quantity: number
  images?: string[]
  is_active: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

// Product form data interface
export interface ProductFormData {
  sku: string
  title: string
  description?: string
  category: string
  make: string          // Correct field name (not 'brand')
  model: string
  year?: number
  mileage?: number
  condition?: string
  original_price: number
  sale_price?: number
  stock_quantity: number
  is_active?: boolean
  images?: string[]
}

// RPC Response interface
interface RPCResponse {
  success: boolean
  message?: string
  error?: string
  product?: Product
  sku_was_changed?: boolean
  original_sku?: string
}

// Get products with filtering and pagination
export async function getProducts(options: {
  category?: string
  isActive?: boolean
  limit?: number
  offset?: number
} = {}): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_products', {
        p_category: options.category || null,
        p_is_active: options.isActive !== undefined ? options.isActive : null,
        p_limit: options.limit || 50,
        p_offset: options.offset || 0
      })

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
}

// Get single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .rpc('get_product_by_id', { p_id: id })

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    // Handle array response from table-returning function
    return Array.isArray(data) && data.length > 0 ? data[0] : null
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

// Get single product by SKU
export async function getProductBySku(sku: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .rpc('get_product_by_sku', { p_sku: sku })

    if (error) {
      console.error('Error fetching product by SKU:', error)
      return null
    }

    // Handle array response from table-returning function
    return Array.isArray(data) && data.length > 0 ? data[0] : null
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

// Check if SKU already exists
export async function checkSkuExists(sku: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('check_sku_exists', { p_sku: sku })

    if (error) {
      console.error('Error checking SKU:', error)
      return false
    }

    return data === true
  } catch (err) {
    console.error('Unexpected error:', err)
    return false
  }
}

// Create new product (uses RPC function)
export async function createProduct(productData: ProductFormData): Promise<{
  success: boolean
  product?: Product
  message?: string
  sku_was_changed?: boolean
  original_sku?: string
}> {
  try {
    const { data, error } = await supabase
      .rpc('create_product', {
        p_category: productData.category,
        p_original_price: productData.original_price,
        p_sku: productData.sku,
        p_stock_quantity: productData.stock_quantity,
        p_title: productData.title,
        p_condition: productData.condition || null,
        p_description: productData.description || null,
        p_images: productData.images || [],
        p_make: productData.make,
        p_mileage: productData.mileage || null,
        p_model: productData.model,
        p_sale_price: productData.sale_price || null,
        p_year: productData.year || null,
        p_is_active: productData.is_active !== undefined ? productData.is_active : true
      })

    if (error) {
      console.error('Error creating product:', error)
      return {
        success: false,
        message: error.message || 'Failed to create product'
      }
    }

    const response = data as RPCResponse
    
    if (!response.success) {
      return {
        success: false,
        message: response.message || 'Failed to create product'
      }
    }

    return {
      success: true,
      product: response.product,
      message: response.message,
      sku_was_changed: response.sku_was_changed,
      original_sku: response.original_sku
    }
    
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

// Update existing product (uses RPC function)
export async function updateProduct(id: string, productData: ProductFormData): Promise<{
  success: boolean
  product?: Product
  message?: string
}> {
  try {
    const { data, error } = await supabase
      .rpc('update_product', {
        p_id: id,
        p_sku: productData.sku,
        p_title: productData.title,
        p_description: productData.description || null,
        p_category: productData.category,
        p_make: productData.make,
        p_model: productData.model,
        p_year: productData.year || null,
        p_mileage: productData.mileage || null,
        p_condition: productData.condition || null,
        p_original_price: productData.original_price,
        p_sale_price: productData.sale_price || null,
        p_stock_quantity: productData.stock_quantity,
        p_is_active: productData.is_active !== undefined ? productData.is_active : null,
        p_images: productData.images || []
      })

    if (error) {
      console.error('Error updating product:', error)
      return {
        success: false,
        message: error.message || 'Failed to update product'
      }
    }

    const response = data as RPCResponse
    
    if (!response.success) {
      return {
        success: false,
        message: response.message || 'Failed to update product'
      }
    }

    return {
      success: true,
      product: response.product,
      message: response.message
    }
    
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

// Delete product (uses RPC function - soft delete)
export async function deleteProduct(id: string): Promise<{
  success: boolean
  message?: string
}> {
  try {
    const { error } = await supabase
      .rpc('delete_product', { p_id: id })

    if (error) {
      console.error('Error deleting product:', error)
      return {
        success: false,
        message: error.message || 'Failed to delete product'
      }
    }

    return {
      success: true,
      message: 'Product deleted successfully'
    }
    
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

// Toggle product active status
export async function toggleProductStatus(id: string, currentStatus: boolean): Promise<{
  success: boolean
  product?: Product
  message?: string
}> {
  try {
    const { data, error } = await supabase
      .rpc('update_product', {
        p_id: id,
        p_sku: null,
        p_title: null,
        p_description: null,
        p_category: null,
        p_make: null,
        p_model: null,
        p_year: null,
        p_mileage: null,
        p_condition: null,
        p_original_price: null,
        p_sale_price: null,
        p_stock_quantity: null,
        p_is_active: !currentStatus,
        p_images: null
      })

    if (error) {
      console.error('Error toggling product status:', error)
      return {
        success: false,
        message: error.message || 'Failed to toggle product status'
      }
    }

    const response = data as RPCResponse
    
    if (!response.success) {
      return {
        success: false,
        message: response.message || 'Failed to toggle product status'
      }
    }

    return {
      success: true,
      product: response.product,
      message: response.message
    }
    
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

// Search products by title or SKU (fallback to direct query for search)
export async function searchProducts(query: string, limit: number = 20): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`title.ilike.%${query}%,sku.ilike.%${query}%`)
      .eq('is_active', true)
      .limit(limit)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching products:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
}

// Get products by category
export async function getProductsByCategory(category: string, limit: number = 20): Promise<Product[]> {
  return getProducts({ category, isActive: true, limit })
}

// Get featured products
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  return getProducts({ isActive: true, limit })
}

// Validate product data
export function validateProductData(data: ProductFormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.sku || data.sku.trim().length === 0) {
    errors.push('SKU is required')
  }

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required')
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push('Category is required')
  }

  if (!data.make || data.make.trim().length === 0) {
    errors.push('Make is required')
  }

  if (!data.model || data.model.trim().length === 0) {
    errors.push('Model is required')
  }

  if (data.original_price < 0) {
    errors.push('Original price must be positive')
  }

  if (data.stock_quantity < 0) {
    errors.push('Stock quantity must be positive')
  }

  if (data.year && (data.year < 1900 || data.year > new Date().getFullYear() + 1)) {
    errors.push('Year must be between 1900 and next year')
  }

  if (data.mileage && data.mileage < 0) {
    errors.push('Mileage must be positive')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Format price for display
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Generate unique SKU
export function generateSKU(category: string, make?: string, model?: string): string {
  const categoryCode = category.substring(0, 3).toUpperCase()
  const makeCode = make ? make.substring(0, 3).toUpperCase() : 'GEN'
  const modelCode = model ? model.substring(0, 3).toUpperCase() : 'MOD'
  const timestamp = Date.now().toString(36).toUpperCase()
  
  return `${categoryCode}-${makeCode}-${modelCode}-${timestamp}`
}

// Helper to show user-friendly messages
export function getUserFriendlyMessage(error: string): string {
  const messages: Record<string, string> = {
    'SKU_ALREADY_EXISTS': 'A product with this SKU already exists. Please use a different SKU.',
    '23505': 'A product with this SKU already exists. Please use a different SKU.',
    'not_found': 'Product not found.',
    'permission_denied': 'You do not have permission to perform this action.',
    'network_error': 'Network error. Please check your connection and try again.',
    'validation_error': 'Please check all required fields and try again.'
  }

  return messages[error] || error || 'An unexpected error occurred.'
}

// Handle SKU conflict gracefully
export async function handleSkuConflict(
  requestedSku: string, 
  productData: ProductFormData
): Promise<{
  success: boolean
  product?: Product
  message: string
  action: 'created' | 'updated' | 'suggested' | 'failed'
  suggestedSku?: string
}> {
  try {
    // First, check if we should update the existing product
    const existingProduct = await getProductBySku(requestedSku)
    
    if (existingProduct) {
      // Ask user if they want to update (in UI)
      return {
        success: false,
        message: `Product with SKU "${requestedSku}" already exists. Would you like to update it?`,
        action: 'suggested'
      }
    }
    
    // Generate a new SKU
    const newSku = generateSKU(productData.category, productData.make, productData.model)
    
    // Try creating with new SKU
    const result = await createProduct({
      ...productData,
      sku: newSku
    })
    
    if (result.success) {
      return {
        success: true,
        product: result.product,
        message: `Product created with new SKU: ${newSku} (original "${requestedSku}" was taken)`,
        action: 'created',
        suggestedSku: newSku
      }
    }
    
    return {
      success: false,
      message: result.message || 'Failed to create product with new SKU',
      action: 'failed'
    }
    
  } catch (err) {
    console.error('Error handling SKU conflict:', err)
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to handle SKU conflict',
      action: 'failed'
    }
  }
}

// Legacy compatibility for existing code
export const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  validateProductData,
  formatPrice,
  generateSKU,
  getUserFriendlyMessage,
  handleSkuConflict
}