import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase/client';
import AdminLayout from '../../components/Admin/AdminLayout';

interface SystemSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  support_phone: string;
  maintenance_mode: boolean;
  allow_registrations: boolean;
  default_commission_rate: number;
  min_order_amount: number;
  max_order_amount: number;
  currency: string;
  timezone: string;
}

interface EmailSettings {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  sender_email: string;
  sender_name: string;
  order_notifications: boolean;
  partner_notifications: boolean;
  user_registrations: boolean;
}

interface PaymentSettings {
  stripe_enabled: boolean;
  stripe_public_key: string;
  stripe_secret_key: string;
  paypal_enabled: boolean;
  paypal_client_id: string;
  paypal_client_secret: string;
  crypto_enabled: boolean;
  crypto_wallet_address: string;
}

export default function AdminSettings() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'system' | 'email' | 'payment'>('system');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    site_name: 'Auto Drive Depot',
    site_description: 'Professional automotive parts and accessories marketplace',
    contact_email: 'admin@autodrivedepot.com',
    support_phone: '+1-234-567-8900',
    maintenance_mode: false,
    allow_registrations: true,
    default_commission_rate: 10,
    min_order_amount: 10,
    max_order_amount: 10000,
    currency: 'USD',
    timezone: 'UTC'
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    sender_email: 'noreply@autodrivedepot.com',
    sender_name: 'Auto Drive Depot',
    order_notifications: true,
    partner_notifications: true,
    user_registrations: true
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    stripe_enabled: false,
    stripe_public_key: '',
    stripe_secret_key: '',
    paypal_enabled: false,
    paypal_client_id: '',
    paypal_client_secret: '',
    crypto_enabled: false,
    crypto_wallet_address: ''
  });

  useEffect(() => {
    if (userProfile?.user_type !== 'admin') {
      navigate('/');
      return;
    }

    loadSettings();
  }, [userProfile, navigate]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Load system settings
      const { data: systemData } = await supabase
        .from('system_settings')
        .select('*')
        .single();

      if (systemData) {
        setSystemSettings(systemData);
      }

      // Load email settings
      const { data: emailData } = await supabase
        .from('email_settings')
        .select('*')
        .single();

      if (emailData) {
        setEmailSettings(emailData);
      }

      // Load payment settings
      const { data: paymentData } = await supabase
        .from('payment_settings')
        .select('*')
        .single();

      if (paymentData) {
        setPaymentSettings(paymentData);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSystemSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          ...systemSettings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
      alert('System settings saved successfully!');
    } catch (error) {
      console.error('Error saving system settings:', error);
      alert('Failed to save system settings');
    } finally {
      setSaving(false);
    }
  };

  const saveEmailSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('email_settings')
        .upsert({
          ...emailSettings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
      alert('Email settings saved successfully!');
    } catch (error) {
      console.error('Error saving email settings:', error);
      alert('Failed to save email settings');
    } finally {
      setSaving(false);
    }
  };

  const savePaymentSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('payment_settings')
        .upsert({
          ...paymentSettings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
      alert('Payment settings saved successfully!');
    } catch (error) {
      console.error('Error saving payment settings:', error);
      alert('Failed to save payment settings');
    } finally {
      setSaving(false);
    }
  };

  const testEmailSettings = async () => {
    try {
      const { error } = await supabase.functions.invoke('test-email-settings', {
        body: emailSettings
      });

      if (error) throw error;
      alert('Test email sent successfully!');
    } catch (error) {
      console.error('Error testing email:', error);
      alert('Failed to send test email');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
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
            <h1 className="text-4xl font-bold mb-2">Admin Settings</h1>
            <p className="text-amber-100/90 text-lg">Manage system configuration and preferences</p>
            <p className="text-amber-100/70 mt-1 text-sm">Configure your platform settings, email, and payment gateways</p>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 mb-6 animate-fade-in hover:shadow-lg transition-shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('system')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === 'system'
                    ? 'border-amber-600 dark:border-amber-400 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                ⚙️ System Settings
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === 'email'
                    ? 'border-amber-600 dark:border-amber-400 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                📧 Email Configuration
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === 'payment'
                    ? 'border-amber-600 dark:border-amber-400 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                💳 Payment Gateways
              </button>
            </nav>
          </div>

          {/* System Settings Tab */}
          {activeTab === 'system' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    🌐 General Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        🏷️ Site Name
                      </label>
                      <input
                        type="text"
                        value={systemSettings.site_name}
                        onChange={(e) => setSystemSettings({...systemSettings, site_name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        📝 Site Description
                      </label>
                      <textarea
                        value={systemSettings.site_description}
                        onChange={(e) => setSystemSettings({...systemSettings, site_description: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          📧 Contact Email
                        </label>
                        <input
                          type="email"
                          value={systemSettings.contact_email}
                          onChange={(e) => setSystemSettings({...systemSettings, contact_email: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          📞 Support Phone
                        </label>
                        <input
                          type="tel"
                          value={systemSettings.support_phone}
                          onChange={(e) => setSystemSettings({...systemSettings, support_phone: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    💼 Business Rules
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          💰 Default Commission Rate (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={systemSettings.default_commission_rate}
                          onChange={(e) => setSystemSettings({...systemSettings, default_commission_rate: parseFloat(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          💵 Currency
                        </label>
                        <select
                          value={systemSettings.currency}
                          onChange={(e) => setSystemSettings({...systemSettings, currency: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="JPY">JPY (¥)</option>
                          <option value="CAD">CAD ($)</option>
                          <option value="AUD">AUD ($)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          📦 Minimum Order Amount
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={systemSettings.min_order_amount}
                          onChange={(e) => setSystemSettings({...systemSettings, min_order_amount: parseFloat(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          📦 Maximum Order Amount
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={systemSettings.max_order_amount}
                          onChange={(e) => setSystemSettings({...systemSettings, max_order_amount: parseFloat(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <input
                          type="checkbox"
                          id="maintenance_mode"
                          checked={systemSettings.maintenance_mode}
                          onChange={(e) => setSystemSettings({...systemSettings, maintenance_mode: e.target.checked})}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <label htmlFor="maintenance_mode" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          🛠️ Enable Maintenance Mode
                        </label>
                      </div>
                      
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <input
                          type="checkbox"
                          id="allow_registrations"
                          checked={systemSettings.allow_registrations}
                          onChange={(e) => setSystemSettings({...systemSettings, allow_registrations: e.target.checked})}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <label htmlFor="allow_registrations" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          👥 Allow New User Registrations
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={saveSystemSettings}
                  disabled={saving}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    '💾 Save System Settings'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Email Settings Tab */}
          {activeTab === 'email' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    📡 SMTP Configuration
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        🔌 SMTP Host
                      </label>
                      <input
                        type="text"
                        value={emailSettings.smtp_host}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_host: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        🔌 SMTP Port
                      </label>
                      <input
                        type="number"
                        value={emailSettings.smtp_port}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_port: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        👤 SMTP Username
                      </label>
                      <input
                        type="text"
                        value={emailSettings.smtp_user}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_user: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        🔑 SMTP Password
                      </label>
                      <input
                        type="password"
                        value={emailSettings.smtp_password}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_password: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    ✉️ Email Preferences
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        📧 Sender Email
                      </label>
                      <input
                        type="email"
                        value={emailSettings.sender_email}
                        onChange={(e) => setEmailSettings({...emailSettings, sender_email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        👤 Sender Name
                      </label>
                      <input
                        type="text"
                        value={emailSettings.sender_name}
                        onChange={(e) => setEmailSettings({...emailSettings, sender_name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all"
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <input
                          type="checkbox"
                          id="order_notifications"
                          checked={emailSettings.order_notifications}
                          onChange={(e) => setEmailSettings({...emailSettings, order_notifications: e.target.checked})}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <label htmlFor="order_notifications" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          📦 Order Notifications
                        </label>
                      </div>
                      
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <input
                          type="checkbox"
                          id="partner_notifications"
                          checked={emailSettings.partner_notifications}
                          onChange={(e) => setEmailSettings({...emailSettings, partner_notifications: e.target.checked})}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <label htmlFor="partner_notifications" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          🏪 Partner Notifications
                        </label>
                      </div>
                      
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <input
                          type="checkbox"
                          id="user_registrations"
                          checked={emailSettings.user_registrations}
                          onChange={(e) => setEmailSettings({...emailSettings, user_registrations: e.target.checked})}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <label htmlFor="user_registrations" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          👤 User Registration Emails
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <button
                  onClick={testEmailSettings}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  📧 Send Test Email
                </button>
                <button
                  onClick={saveEmailSettings}
                  disabled={saving}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    '💾 Save Email Settings'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Payment Settings Tab */}
          {activeTab === 'payment' && (
            <div className="p-6">
              <div className="space-y-8">
                {/* Stripe Settings */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    💳 Stripe Configuration
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <input
                        type="checkbox"
                        id="stripe_enabled"
                        checked={paymentSettings.stripe_enabled}
                        onChange={(e) => setPaymentSettings({...paymentSettings, stripe_enabled: e.target.checked})}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor="stripe_enabled" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                        Enable Stripe Payments
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          🔑 Stripe Public Key
                        </label>
                        <input
                          type="text"
                          value={paymentSettings.stripe_public_key}
                          onChange={(e) => setPaymentSettings({...paymentSettings, stripe_public_key: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!paymentSettings.stripe_enabled}
                          placeholder="pk_live_..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          🔐 Stripe Secret Key
                        </label>
                        <input
                          type="password"
                          value={paymentSettings.stripe_secret_key}
                          onChange={(e) => setPaymentSettings({...paymentSettings, stripe_secret_key: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!paymentSettings.stripe_enabled}
                          placeholder="sk_live_..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* PayPal Settings */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    💰 PayPal Configuration
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <input
                        type="checkbox"
                        id="paypal_enabled"
                        checked={paymentSettings.paypal_enabled}
                        onChange={(e) => setPaymentSettings({...paymentSettings, paypal_enabled: e.target.checked})}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor="paypal_enabled" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                        Enable PayPal Payments
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          🔑 PayPal Client ID
                        </label>
                        <input
                          type="text"
                          value={paymentSettings.paypal_client_id}
                          onChange={(e) => setPaymentSettings({...paymentSettings, paypal_client_id: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!paymentSettings.paypal_enabled}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          🔐 PayPal Client Secret
                        </label>
                        <input
                          type="password"
                          value={paymentSettings.paypal_client_secret}
                          onChange={(e) => setPaymentSettings({...paymentSettings, paypal_client_secret: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!paymentSettings.paypal_enabled}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Crypto Settings */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    ₿ Cryptocurrency Configuration
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <input
                        type="checkbox"
                        id="crypto_enabled"
                        checked={paymentSettings.crypto_enabled}
                        onChange={(e) => setPaymentSettings({...paymentSettings, crypto_enabled: e.target.checked})}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor="crypto_enabled" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                        Enable Crypto Payments
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        👛 Default Wallet Address
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.crypto_wallet_address}
                        onChange={(e) => setPaymentSettings({...paymentSettings, crypto_wallet_address: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!paymentSettings.crypto_enabled}
                        placeholder="0x..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={savePaymentSettings}
                  disabled={saving}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    '💾 Save Payment Settings'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}