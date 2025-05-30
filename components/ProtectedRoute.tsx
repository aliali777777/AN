
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { UserNavigation } from './common/UserNavigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Log navigation to help with debugging
    console.log(`Navigation to: ${location.pathname}, authenticated: ${isAuthenticated}`);
    
    if (isAuthenticated && currentUser) {
      console.log("User authenticated:", currentUser.username);
    }
  }, [location, isAuthenticated, currentUser]);
  
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    // Pass the current location so we can redirect back after login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <UserNavigation />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default ProtectedRoute;
