import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: ('customer' | 'partner' | 'admin')[];
  redirectTo?: string;
}

/**
 * Role-Based Route Protection Component
 * Restricts access based on user_type in userProfile
 */
export function RoleBasedRoute({
  children,
  allowedRoles,
  redirectTo = '/'
}: RoleBasedRouteProps) {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // User not authenticated or no profile
  if (!userProfile) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user role is allowed
  if (!allowedRoles.includes(userProfile.user_type)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

interface AdminOnlyRouteProps {
  children: ReactNode;
}

/**
 * Admin-Only Route Protection
 * Redirects non-admins to home page
 */
export function AdminOnlyRoute({ children }: AdminOnlyRouteProps) {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // User not authenticated or no profile
  if (!userProfile) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user role is admin
  if (userProfile.user_type !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

interface PartnerOnlyRouteProps {
  children: ReactNode;
  requireApproved?: boolean;
}

/**
 * Partner-Only Route Protection
 * Can optionally require approval before accessing
 */
export function PartnerOnlyRoute({
  children,
  requireApproved = false
}: PartnerOnlyRouteProps) {
  const { userProfile, loading } = useAuth();

  console.log('PartnerOnlyRoute - Debug:', {
    loading,
    userProfile: userProfile ? {
      id: userProfile.id,
      user_type: userProfile.user_type,
      partner_status: userProfile.partner_status
    } : null,
    requireApproved
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!userProfile) {
    console.log('PartnerOnlyRoute - No user profile, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Must be a partner
  if (userProfile.user_type !== 'partner') {
    console.log('PartnerOnlyRoute - User is not a partner, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // If approval is required, check status
  if (requireApproved && userProfile.partner_status !== 'approved') {
    console.log('PartnerOnlyRoute - Partner not approved, redirecting to pending');
    return <Navigate to="/partner/pending" replace />;
  }

  console.log('PartnerOnlyRoute - All checks passed, rendering children');
  return <>{children}</>;
}

interface CustomerOnlyRouteProps {
  children: ReactNode;
}

/**
 * Customer-Only Route Protection
 * Redirects non-customers to home page
 */
export function CustomerOnlyRoute({ children }: CustomerOnlyRouteProps) {
  return (
    <RoleBasedRoute allowedRoles={['customer']} redirectTo="/">
      {children}
    </RoleBasedRoute>
  );
}
