import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ROUTE_LABELS = {
  // Partner Dashboard
  partner: 'Partner',
  dashboard: 'Dashboard',
  wallet: 'Wallet',
  deposit: 'Deposit',
  withdraw: 'Withdraw',
  earnings: 'Earnings',
  inventory: 'Inventory',
  analytics: 'Analytics',
  settings: 'Settings',
  
  // Admin Dashboard
  admin: 'Admin',
  users: 'Users',
  partners: 'Partners',
  
  // Public Routes
  stores: 'Stores',
  manufacturers: 'Manufacturers',
  about: 'About',
  contact: 'Contact',
  help: 'Help',
  returns: 'Returns',
  faq: 'FAQ',
  shipping: 'Shipping',
  track: 'Track',
  
  // Auth
  auth: 'Authentication',
  register: 'Register',
  
  // Cart & Checkout
  cart: 'Cart',
  checkout: 'Checkout',
  payment: 'Payment',
  
  // Generic
  orders: 'Orders',
  products: 'Products',
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const segments = pathname.split('/').filter(Boolean);

  const items = segments.map((segment, idx) => {
    const path = '/' + segments.slice(0, idx + 1).join('/');
    return {
      label: ROUTE_LABELS[segment] || segment,
      path,
      isLast: idx === segments.length - 1,
    };
  });

  // Don't show breadcrumbs on homepage
  if (segments.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <nav className="flex items-center text-sm text-gray-400">
        {items.map((item, i) => (
          <div key={item.path} className="flex items-center">
            {item.isLast ? (
              <span className="font-medium text-gray-200">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-blue-400 transition"
              >
                {item.label}
              </Link>
            )}
            {i < items.length - 1 && (
              <ChevronRight className="w-4 h-4 mx-2" />
            )}
          </div>
        ))}
      </nav>

      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-blue-400"
      >
        ← Back
      </button>
    </div>
  );
}
