// frontend/src/routes/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';

export const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user, fetchUser, isInitialized } = useUserStore();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔒 ProtectedRoute: Checking authentication...');
      
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      console.log('🔒 Token exists:', !!token);
      
      if (!token) {
        console.log('🔒 No token found, redirecting to login');
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }

      if (user && isInitialized) {
        console.log('🔒 User already in store:', user?.full_name);
        setIsAuthenticated(true);
        setIsChecking(false);
        return;
      }

      try {
        const userData = await fetchUser();
        console.log('🔒 Fetch user result:', !!userData);
        setIsAuthenticated(!!userData);
      } catch (error) {
        console.error('🔒 Auth check failed:', error);
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [fetchUser, user, isInitialized]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-muted dark:text-dark-muted">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔒 Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('🔒 Authenticated, rendering protected content');
  return children;
};