// Complete Partner Profile Implementation Guide
// Replace all direct table queries with RPC calls

import React, { useState, useEffect } from 'react'
import { getPartnerProfile, createPartnerProfile, updatePartnerProfile } from '../services/partnerService'

// Example Component: PartnerProfileManager
export function PartnerProfileManager() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    phone: '',
    address: ''
  })

  // Load profile on component mount
  useEffect(() => {
    async function loadProfile() {
      const userId = '4b3628ab-bd6a-424e-b99a-857d6c9a7fbc' // Replace with actual user ID
      
      try {
        const profileData = await getPartnerProfile(userId)
        if (profileData) {
          setProfile(profileData)
          setFormData({
            company_name: profileData.company_name || '',
            contact_person: profileData.contact_person || '',
            phone: profileData.phone || '',
            address: profileData.address || ''
          })
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    const userId = '4b3628ab-bd6a-424e-b99a-857d6c9a7fbc' // Replace with actual user ID

    try {
      if (profile) {
        // Update existing profile
        const updatedProfile = await updatePartnerProfile(userId, formData)
        if (updatedProfile) {
          setProfile(updatedProfile)
          setEditing(false)
          console.log('Profile updated successfully!')
        }
      } else {
        // Create new profile
        const newProfile = await createPartnerProfile({
          user_id: userId,
          company_name: formData.company_name,
          contact_person: formData.contact_person,
          phone: formData.phone,
          address: formData.address
        })
        if (newProfile) {
          setProfile(newProfile)
          setEditing(false)
          console.log('Profile created successfully!')
        }
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    }
  }

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        <p className="ml-4 text-slate-600">Loading partner profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Partner Profile</h2>
      
      {profile && !editing && (
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-slate-800">Company Information</h3>
            <p className="text-slate-600">Company: {profile.company_name || 'Not set'}</p>
            <p className="text-slate-600">Contact: {profile.contact_person || 'Not set'}</p>
            <p className="text-slate-600">Phone: {profile.phone || 'Not set'}</p>
            <p className="text-slate-600">Address: {profile.address || 'Not set'}</p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      )}

      {(!profile || editing) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contact Person
            </label>
            <input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter contact person name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter address"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition-colors"
            >
              {profile ? 'Update Profile' : 'Create Profile'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-slate-300 text-slate-700 px-6 py-2 rounded-md hover:bg-slate-400 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

// Usage in your main component:
/*
import { PartnerProfileManager } from './components/PartnerProfileManager'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PartnerProfileManager />
    </div>
  )
}
*/
