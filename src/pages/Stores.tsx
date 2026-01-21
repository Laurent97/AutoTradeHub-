import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Store, MapPin, TrendingUp, Package, Star, Users } from 'lucide-react';

interface PartnerStore {
  id: string;
  user_id: string;
  store_name: string;
  store_slug: string;
  description?: string;
  partner_status: string;
  is_active: boolean;
  created_at: string;
  // Optional fields that might not exist
  logo_url?: string;
  country?: string;
  city?: string;
  total_earnings?: number;
  store_visits?: number;
}

export default function Stores() {
  const [stores, setStores] = useState<PartnerStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('partner_profiles')
        .select('*')
        .eq('is_active', true)
        .eq('partner_status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading stores:', error);
        setError('Failed to load stores');
        return;
      }

      setStores(data || []);
    } catch (error) {
      console.error('Error loading stores:', error);
      setError('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter(store => {
    if (searchTerm && !store.store_name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filterCountry !== 'all' && store.country !== filterCountry) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.store_visits || 0) - (a.store_visits || 0);
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'earnings':
        return (b.total_earnings || 0) - (a.total_earnings || 0);
      case 'name':
        return a.store_name.localeCompare(b.store_name);
      default:
        return 0;
    }
  });

  const countries = [...new Set(stores.map(store => store.country).filter(Boolean))];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Partner Stores Directory
            </h1>
            <p className="text-gray-600">
              Discover and shop from our trusted partner stores worldwide
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Stores
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter store name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  title="Filter by country"
                >
                  <option value="all">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  title="Sort stores by"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="earnings">Top Earning</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={loadStores}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Store className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {stores.length}
                  </div>
                  <div className="text-gray-700">Active Stores</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <MapPin className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {countries.length}
                  </div>
                  <div className="text-gray-700">Countries</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <div className="text-3xl font-bold text-purple-600">
                    ${stores.reduce((sum, store) => sum + (store.total_earnings || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-gray-700">Total Sales</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <div className="text-3xl font-bold text-orange-600">
                    {stores.reduce((sum, store) => sum + (store.store_visits || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-gray-700">Total Visits</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stores Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading stores...</p>
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Stores Found</h3>
              <p className="text-gray-600">No stores found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => (
                <Link
                  key={store.id}
                  to={`/store/${store.store_slug}`}
                  className="bg-white rounded-lg shadow hover:shadow-xl transition group"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {store.logo_url ? (
                        <img
                          src={store.logo_url}
                          alt={store.store_name}
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <Store className="w-8 h-8 text-blue-600" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600">
                          {store.store_name}
                        </h3>
                        <div className="text-sm text-gray-500">
                          {store.city && store.country ? `${store.city}, ${store.country}` : 
                           store.country || store.city || 'Location not specified'}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {store.description || 'Quality automotive parts and accessories'}
                    </p>
                    
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {store.store_visits || 0} visits
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {formatCurrency(store.total_earnings || 0)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-yellow-600">4.8</span>
                      </div>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        <span>Active</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-blue-600 group-hover:text-blue-800 flex items-center justify-center font-medium">
                        Visit Store
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
