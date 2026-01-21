import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface PartnerStore {
  id: string;
  store_name: string;
  store_slug: string;
  description: string;
  logo_url: string;
  country: string;
  city: string;
  total_earnings: number;
  store_visits: number;
  created_at: string;
}

export default function Stores() {
  const [stores, setStores] = useState<PartnerStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('partner_profiles')
        .select('*')
        .eq('is_active', true)
        .eq('partner_status', 'approved')
        .order('store_visits', { ascending: false });

      if (error) throw error;
      setStores(data || []);
    } catch (error) {
      console.error('Error loading stores:', error);
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

  const countries = [...new Set(stores.map(store => store.country))].filter(Boolean);

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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stores.length}
              </div>
              <div className="text-gray-700">Active Stores</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {countries.length}
              </div>
              <div className="text-gray-700">Countries</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                ${stores.reduce((sum, store) => sum + (store.total_earnings || 0), 0).toLocaleString()}
              </div>
              <div className="text-gray-700">Total Sales</div>
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
              <p className="text-gray-600">No stores found matching your criteria</p>
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
                          <span className="text-blue-600 font-bold text-xl">
                            {store.store_name.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600">
                          {store.store_name}
                        </h3>
                        <div className="text-sm text-gray-500">
                          {store.city}, {store.country}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {store.description || 'No description available'}
                    </p>
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {store.store_visits || 0} visits
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h2v2a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2h-2V4a2 2 0 00-2-2H4zm2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-2H4a2 2 0 01-2-2V8a2 2 0 012-2h2z" clipRule="evenodd" />
                        </svg>
                        ${(store.total_earnings || 0).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-blue-600 group-hover:text-blue-800 flex items-center justify-center">
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
