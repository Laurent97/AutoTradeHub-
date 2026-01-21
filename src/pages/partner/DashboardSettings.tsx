import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { partnerService } from '../../lib/supabase/partner-service';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function DashboardSettings() {
  const { userProfile } = useAuth();
  const [settings, setSettings] = useState({
    storeName: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    country: '',
    city: '',
    taxId: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, [userProfile]);

  const loadSettings = async () => {
    if (!userProfile?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await partnerService.getPartnerSettings(userProfile.id);
      if (error) throw error;
      
      if (data) {
        setSettings({
          storeName: data.store_name || '',
          description: data.description || '',
          contactEmail: data.contact_email || '',
          contactPhone: data.contact_phone || '',
          country: data.country || '',
          city: data.city || '',
          taxId: data.tax_id || '',
        });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!userProfile?.id) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const { error } = await partnerService.updatePartnerSettings(userProfile.id, {
        store_name: settings.storeName,
        description: settings.description,
        contact_email: settings.contactEmail,
        contact_phone: settings.contactPhone,
        country: settings.country,
        city: settings.city,
        tax_id: settings.taxId,
      });

      if (error) throw error;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Store Settings</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Store Information */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Store Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store Name</label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your store name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={settings.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe your store and what you offer"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="contact@store.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={settings.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={settings.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your city"
              />
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tax Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tax ID</label>
            <input
              type="text"
              name="taxId"
              value={settings.taxId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Your tax identification number"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Required for invoice generation and tax compliance</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {saved && (
            <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
              ✓ Settings saved successfully
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
