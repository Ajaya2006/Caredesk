import api from "./index";

export const login = (email, password) => {
  const data = new URLSearchParams();
  data.append("username", email);
  data.append("password", password);
  return api.post('/auth/login', data.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export const register = (formData) => {
  return api.post('/auth/register', formData);
};

export const googleLogin = (accessToken) => {
  return api.post('/auth/google', { access_token: accessToken });
};

export const logout = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return api.get('/auth/me');
};
