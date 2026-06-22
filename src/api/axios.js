import axios from 'axios';

const API_BASE = 'https://cinema-booking-w2yo.onrender.com';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

// Tự động gắn Bearer Token vào mọi request nếu đã đăng nhập
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function saveToken(token) {
  localStorage.setItem('auth_token', token);
}

export function clearToken() {
  localStorage.removeItem('auth_token');
}

export function getToken() {
  return localStorage.getItem('auth_token');
}

export default api;
