import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // gửi/nhận session cookie
  withXSRFToken: true,   // axios tự đọc cookie XSRF-TOKEN và gắn vào header
});

// Laravel Sanctum yêu cầu lấy CSRF cookie trước khi gọi login/register
export async function ensureCsrfCookie() {
  await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
}

export default api;
