import axios from 'axios';

const API_BASE = 'https://cinema-booking-w2yo.onrender.com';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  withXSRFToken: true,
});

export async function ensureCsrfCookie() {
  await axios.get(`${API_BASE}/sanctum/csrf-cookie`, { withCredentials: true });
}

export default api;