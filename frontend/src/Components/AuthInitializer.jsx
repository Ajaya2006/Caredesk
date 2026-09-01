// frontend/src/components/AuthInitializer.jsx

import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';

export const AuthInitializer = ({ children }) => {
  const { fetchUser, user, isInitialized } = useUserStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (token && !user && !isInitialized) {
        console.log('🔄 AuthInitializer: Fetching user...');
        await fetchUser();
      } else {
        console.log('🔄 AuthInitializer: Already initialized or no token');
      }
    };

    initAuth();
  }, [fetchUser, user, isInitialized]);

  return children;
};