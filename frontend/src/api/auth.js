// frontend/src/api/auth.js

import api from "./index";

export const login = (email, password) => {
  const data = new URLSearchParams();
  data.append("username", email);
  data.append("password", password);
  return api.post('/auth/login', data.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export const register = (userData) => {
  return api.post('/auth/register', userData);
};

export const googleLogin = (accessToken) => {
  return api.post('/auth/google', { access_token: accessToken });
};

export const logout = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    return Promise.reject(new Error('No token found'));
  }
  return api.get('/auth/me');
};

// For Google login, get user info from Google API
export const getGoogleUserInfo = async (accessToken) => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Google user info');
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching Google user info:', error);
    throw error;
  }
};

// Get user with profile image from Google
export const getCurrentUserWithImage = async () => {
  try {
    const response = await getCurrentUser();
    const userData = response.data;
    
    // If user has a Google picture, add it to the user object
    if (userData && userData.picture) {
      userData.profile_image = userData.picture;
    }
    
    return userData;
  } catch (error) {
    console.error('❌ Error fetching user with image:', error);
    throw error;
  }
};