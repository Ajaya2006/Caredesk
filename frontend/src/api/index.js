// frontend/src/api/index.js

import axios from "axios";

// ✅ Use the correct backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://caredesk-dd8k.onrender.com/api/v1';

console.log("========== API CONFIG ==========");
console.log("API URL:", API_URL);
console.log("Environment:", import.meta.env.MODE);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Better error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("========== API ERROR ==========");
    console.error("URL:", error.config?.baseURL + error.config?.url);
    console.error("Method:", error.config?.method);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.error("===============================");

    // If unauthorized (401), clear token and redirect to login
    if (error.response?.status === 401) {
      console.warn("Unauthorized - clearing token and redirecting to login");
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;