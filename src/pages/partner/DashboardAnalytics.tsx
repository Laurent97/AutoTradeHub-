import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { partnerService } from '../../lib/supabase/partner-service';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function DashboardAnalytics() {
  const { userProfile } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [userProfile]);

  const loadAnalytics = async () => {
    if (!userProfile?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await partnerService.getDetailedAnalytics(userProfile.id);
      if (data && data.data) {
        setAnalytics(data.data);
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Analytics</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">
          <p>No analytics data available</p>
        </div>
      </div>
    );
  }

  const metrics = analytics.metrics || {};

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Analytics Overview</h2>
        <p className="text-gray-600 mb-4">Track your store performance and customer behavior</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-2">Total Views</div>
              <div className="text-3xl font-bold text-blue-600">{metrics.totalViews || 0}</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">👁</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-2">Total Sales</div>
              <div className="text-3xl font-bold text-green-600">{metrics.totalSales || 0}</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-2">Total Earnings</div>
              <div className="text-3xl font-bold text-yellow-600">${(metrics.totalRevenue || 0).toFixed(2)}</div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">💵</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-2">Conversion Rate</div>
              <div className="text-3xl font-bold text-purple-600">{(metrics.conversionRate || 0).toFixed(1)}%</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-2">Avg Order Value</div>
              <div className="text-3xl font-bold text-orange-600">${(metrics.avgOrderValue || 0).toFixed(2)}</div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-xl">📦</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-gray-700 text-sm">
            <div className="font-medium">Top Performing Products</div>
            <div className="text-2xl font-bold text-gray-900">-</div>
          </div>
          <div className="text-gray-700 text-sm">
            <div className="font-medium">Low Stock Products</div>
            <div className="text-2xl font-bold text-red-600">-</div>
          </div>
          <div className="text-gray-700 text-sm">
            <div className="font-medium">Recent Activity</div>
            <div className="text-2xl font-bold text-gray-900">No recent activity</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Analytics Tips:</strong> Monitor your conversion rate and average order value to optimize your product listings and pricing strategy.
        </p>
      </div>
    </div>
  );
}
