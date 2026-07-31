import api from './index';

export const login = (username, password) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  
  return api.post('/auth/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const getCurrentUser = () => api.get('/auth/me');

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};