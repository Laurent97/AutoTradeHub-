// Partner Profile Service (Fixes 406 Error with RPC)
// Use this instead of direct table queries

import { supabase } from '../lib/supabase/client'

// Get single partner profile (bypasses 406 error)
export async function getPartnerProfile(userId) {
  try {
    console.log('Fetching partner profile via RPC for user:', userId)
    
    const { data, error, status } = await supabase
      .rpc('get_partner_profile', { 
        p_user_id: userId 
      })
    
    if (error) {
      console.error('RPC Error:', error, 'Status:', status)
      return null
    }
    
    console.log('Partner profile data:', data)
    return data
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

// Get all partner profiles
export async function getAllPartnerProfiles() {
  try {
    const { data, error } = await supabase
      .rpc('get_all_partner_profiles')
    
    if (error) {
      console.error('RPC Error:', error)
      return []
    }
    
    return data || []
  } catch (err) {
    console.error('Unexpected error:', err)
    return []
  }
}

// Create partner profile
export async function createPartnerProfile(profileData) {
  try {
    const { data, error } = await supabase
      .rpc('create_partner_profile', {
        p_user_id: profileData.user_id,
        p_company_name: profileData.company_name || null,
        p_contact_person: profileData.contact_person || null,
        p_phone: profileData.phone || null,
        p_address: profileData.address || null
      })
    
    if (error) {
      console.error('RPC Error:', error)
      return null
    }
    
    return data
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

// Update partner profile (fallback to direct query if needed)
export async function updatePartnerProfile(userId, updateData) {
  try {
    const { data, error } = await supabase
      .from('partner_profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single() // Use .single() for update
    
    if (error) {
      console.error('Update Error:', error)
      return null
    }
    
    return data
  } catch (err) {
    console.error('Unexpected error:', err)
    return null
  }
}

// Delete partner profile
export async function deletePartnerProfile(userId) {
  try {
    const { error } = await supabase
      .from('partner_profiles')
      .delete()
      .eq('user_id', userId)
    
    if (error) {
      console.error('Delete Error:', error)
      return false
    }
    
    return true
  } catch (err) {
    console.error('Unexpected error:', err)
    return false
  }
}

// Usage example in React component:
/*
import { getPartnerProfile, createPartnerProfile } from './partner-service'

// In your component:
const [partnerProfile, setPartnerProfile] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  async function loadProfile() {
    const userId = '4b3628ab-bd6a-424e-b99a-857d6c9a7fbc'
    const profile = await getPartnerProfile(userId)
    setPartnerProfile(profile)
    setLoading(false)
  }
  
  loadProfile()
}, [])

const handleCreateProfile = async (profileData) => {
  const newProfile = await createPartnerProfile({
    user_id: '4b3628ab-bd6a-424e-b99a-857d6c9a7fbc',
    company_name: profileData.companyName,
    contact_person: profileData.contactPerson,
    phone: profileData.phone,
    address: profileData.address
  })
  
  if (newProfile) {
    setPartnerProfile(newProfile)
    console.log('Profile created successfully!')
  }
}
*/
