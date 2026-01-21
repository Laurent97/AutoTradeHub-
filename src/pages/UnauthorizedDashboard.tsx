import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function UnauthorizedDashboard() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  useEffect(() => {
    // Redirect to appropriate dashboard based on user role
    if (userProfile) {
      if (userProfile.user_type === 'admin') {
        navigate('/admin');
      } else if (userProfile.user_type === 'partner') {
        if (userProfile.partner_status === 'approved') {
          navigate('/partner/dashboard');
        } else {
          navigate('/partner/pending');
        }
      } else {
        navigate('/');
      }
    } else {
      navigate('/auth');
    }
  }, [userProfile, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
