// frontend/src/store/userStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCurrentUser } from '../api/auth';

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      setUser: (user) => {
        const userWithImage = {
          ...user,
          profile_image: user?.picture || user?.profile_image || null
        };
        console.log('👤 Setting user:', userWithImage?.full_name);
        set({ user: userWithImage, error: null, isInitialized: true });
      },

      clearUser: () => {
        console.log('🗑️ Clearing user data...');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        set({ 
          user: null, 
          error: null, 
          isLoading: false,
          isInitialized: true 
        });
      },

      fetchUser: async () => {
        const { user, isLoading, isInitialized } = get();
        
        if (isLoading) {
          console.log('⏳ Already loading user...');
          return user;
        }
        
        if (user && isInitialized) {
          console.log('✅ User already loaded:', user?.full_name);
          return user;
        }

        set({ isLoading: true, error: null });

        try {
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          
          if (!token) {
            console.warn('⚠️ No token found, clearing user');
            set({ 
              user: null, 
              isLoading: false, 
              isInitialized: true,
              error: 'No authentication token found'
            });
            return null;
          }

          console.log('📡 Fetching user from API...');
          const response = await getCurrentUser();
          const userData = response.data;
          
          const userWithImage = {
            ...userData,
            profile_image: userData?.picture || userData?.profile_image || null
          };
          
          console.log('✅ User fetched:', userWithImage?.full_name);
          set({ 
            user: userWithImage, 
            isLoading: false, 
            isInitialized: true,
            error: null 
          });
          return userWithImage;
        } catch (error) {
          console.error('❌ Failed to fetch user:', error);
          
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            set({ 
              user: null, 
              isLoading: false, 
              isInitialized: true,
              error: 'Session expired. Please login again.'
            });
            return null;
          }
          
          set({ 
            error: error.response?.data?.detail || 'Failed to fetch user', 
            isLoading: false,
            isInitialized: true
          });
          return null;
        }
      },

      reset: () => {
        console.log('🔄 Resetting store...');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('user-storage');
        set({ 
          user: null, 
          error: null, 
          isLoading: false,
          isInitialized: true 
        });
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user,
        isInitialized: state.isInitialized 
      }),
    }
  )
);