import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredUserType?: 'customer' | 'partner' | 'admin';
  requirePartnerApproved?: boolean;
}

export const ProtectedRoute = ({
  children,
  requiredUserType,
  requirePartnerApproved = false,
}: ProtectedRouteProps) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredUserType && userProfile?.user_type !== requiredUserType) {
    return <Navigate to="/" replace />;
  }

  if (
    requirePartnerApproved &&
    (userProfile?.user_type !== 'partner' || userProfile?.partner_status !== 'approved')
  ) {
    return <Navigate to="/partner/pending" replace />;
  }

  return <>{children}</>;
};
