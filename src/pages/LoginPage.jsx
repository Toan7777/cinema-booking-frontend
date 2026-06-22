import { useState } from 'react';
import api, { saveToken } from '../api/axios';

export default function LoginPage({ onLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url = isRegister ? '/auth/register' : '/auth/login';
      const body = isRegister ? { fullName, email, password } : { email, password };
      const res = await api.post(url, body);
      saveToken(res.data.token);
      onLoggedIn(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="marquee-lights">
        {Array.from({ length: 18 }).map((_, i) => <span key={i} />)}
      </div>
      <div className="reel-strip" />
      <div className="ticket-card">
        <div className="brand-row">
          <span className="dot" />
          <span className="brand-eyebrow">Suất chiếu mở bán 24/7</span>
        </div>
        <h1 className="display auth-title">
          {isRegister ? 'Tạo vé' : 'Vào rạp'}
        </h1>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="field">
              <label>Họ tên</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Đang xử lý...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </form>

        <a className="switch-link" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Đã có vé? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
        </a>
      </div>
    </div>
  );
}
