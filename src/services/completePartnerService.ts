// Complete Partner Service (Force Fix for 406 Errors)
// This replaces ALL direct table queries with RPC functions

import { supabase } from '../lib/supabase/client'

// Partner profile interface
export interface PartnerProfile {
  id: string
  user_id: string
  store_name: string
  store_description?: string
  store_slug: string
  partner_status: 'pending' | 'approved' | 'rejected'
  is_active: boolean
  store_visits?: number
  total_earnings?: number
  commission_rate?: number
  created_at: string
  updated_at: string
}

// Get partner profile by user_id (MAIN FUNCTION - fixes 406 errors)
export async function getPartnerProfileByUserId(userId: string): Promise<PartnerProfile | null> {
  try {
    const { data, error } = await supabase
      .rpc('get_partner_profile_by_user_id', { p_user_id: userId })

    if (error) {
      console.error('Error fetching partner profile by user ID:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

// Get partner profile by store_slug
export async function getPartnerProfileBySlug(storeSlug: string): Promise<PartnerProfile | null> {
  try {
    const { data, error } = await supabase
      .rpc('get_partner_profile_by_slug', { p_store_slug: storeSlug })

    if (error) {
      console.error('Error fetching partner profile by slug:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

// Get all active partners
export async function getActivePartners(): Promise<PartnerProfile[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_active_partners')

    if (error) {
      console.error('Error fetching active partners:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
}

// Get all partners (for admin)
export async function getAllPartners(): Promise<PartnerProfile[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_all_partners')

    if (error) {
      console.error('Error fetching all partners:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
}

// Update partner profile
export async function updatePartnerProfile(userId: string, updates: Partial<PartnerProfile>): Promise<PartnerProfile | null> {
  try {
    const { data, error } = await supabase
      .rpc('update_partner_profile', {
        p_user_id: userId,
        p_updates: updates
      })

    if (error) {
      console.error('Error updating partner profile:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

// Update partner by ID (for admin)
export async function updatePartnerById(partnerId: string, updates: Partial<PartnerProfile>): Promise<PartnerProfile | null> {
  try {
    const { data, error } = await supabase
      .rpc('update_partner_by_id', {
        p_id: partnerId,
        p_updates: updates
      })

    if (error) {
      console.error('Error updating partner by ID:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

// Increment store visits
export async function incrementStoreVisits(storeSlug: string): Promise<PartnerProfile | null> {
  try {
    const { data, error } = await supabase
      .rpc('increment_store_visits', { p_store_slug: storeSlug })

    if (error) {
      console.error('Error incrementing store visits:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

// Update partner earnings
export async function updatePartnerEarnings(partnerId: string, amount: number): Promise<PartnerProfile | null> {
  try {
    const { data, error } = await supabase
      .rpc('update_partner_earnings', {
        p_id: partnerId,
        p_amount: amount
      })

    if (error) {
      console.error('Error updating partner earnings:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

// Get partner stats
export async function getPartnerStats(): Promise<{
  total_partners: number
  active_partners: number
  approved_partners: number
  pending_partners: number
} | null> {
  try {
    const { data, error } = await supabase
      .rpc('get_partner_stats')

    if (error) {
      console.error('Error fetching partner stats:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

// Check if slug exists
export async function checkSlugExists(storeSlug: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('check_slug_exists', { p_store_slug: storeSlug })

    if (error) {
      console.error('Error checking slug exists:', error)
      return false
    }

    return data || false
  } catch (err) {
    console.error('Unexpected error:', err)
    return false
  }
}

// Create partner profile
export async function createPartnerProfile(
  userId: string,
  storeName: string,
  storeDescription?: string,
  storeSlug?: string,
  partnerStatus: 'pending' | 'approved' | 'rejected' = 'pending',
  isActive: boolean = false
): Promise<PartnerProfile | null> {
  try {
    const { data, error } = await supabase
      .rpc('create_partner_profile_comprehensive', {
        p_user_id: userId,
        p_store_name: storeName,
        p_store_description: storeDescription || null,
        p_store_slug: storeSlug || '',
        p_partner_status: partnerStatus,
        p_is_active: isActive
      })

    if (error) {
      console.error('Error creating partner profile:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

// Delete partner profile
export async function deletePartnerProfile(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .rpc('delete_partner_profile', { p_user_id: userId })

    if (error) {
      console.error('Error deleting partner profile:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Unexpected error:', err)
    return false
  }
}

// Legacy compatibility functions (for existing code)

// Get partner by user ID (alias for getPartnerProfileByUserId)
export const getPartnerProfile = getPartnerProfileByUserId

// Update partner status (admin function)
export async function updatePartnerStatus(partnerId: string, status: 'pending' | 'approved' | 'rejected'): Promise<boolean> {
  const result = await updatePartnerById(partnerId, { partner_status: status })
  return result !== null
}

// Approve partner
export async function approvePartner(partnerId: string): Promise<boolean> {
  return updatePartnerStatus(partnerId, 'approved')
}

// Reject partner
export async function rejectPartner(partnerId: string): Promise<boolean> {
  return updatePartnerStatus(partnerId, 'rejected')
}

// Toggle partner active status
export async function togglePartnerStatus(partnerId: string, currentStatus: boolean): Promise<boolean> {
  const result = await updatePartnerById(partnerId, { is_active: !currentStatus })
  return result !== null
}

// Generate store slug
export function generateStoreSlug(storeName: string): string {
  return storeName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Validate store slug
export function validateStoreSlug(slug: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!slug || slug.trim().length === 0) {
    errors.push('Store slug is required')
  }

  if (slug.length < 3) {
    errors.push('Store slug must be at least 3 characters')
  }

  if (slug.length > 50) {
    errors.push('Store slug must be less than 50 characters')
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push('Store slug can only contain lowercase letters, numbers, and hyphens')
  }

  if (slug.startsWith('-') || slug.endsWith('-')) {
    errors.push('Store slug cannot start or end with a hyphen')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Search partners by store name
export async function searchPartners(query: string, limit: number = 20): Promise<PartnerProfile[]> {
  try {
    // Use direct query for search (RPC doesn't support search)
    const { data, error } = await supabase
      .from('partner_profiles')
      .select('*')
      .or(`store_name.ilike.%${query}%,store_slug.ilike.%${query}%`)
      .eq('is_active', true)
      .limit(limit)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching partners:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
}

// Get partners by status
export async function getPartnersByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<PartnerProfile[]> {
  try {
    // Use direct query for status filtering
    const { data, error } = await supabase
      .from('partner_profiles')
      .select('*')
      .eq('partner_status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching partners by status:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
}
