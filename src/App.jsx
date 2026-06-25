import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import SeatMap from './components/SeatMap';
import api, { getToken, clearToken } from './api/axios';

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setChecking(false);
      return;
    }
    api.get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => clearToken())
      .finally(() => setChecking(false));
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // dù lỗi vẫn xóa token local để đăng xuất phía client
    }
    clearToken();
    setUser(null);
  };

  if (checking) return null;

  if (!user) {
    return <LoginPage onLoggedIn={setUser} />;
  }

  return (
    <div className="app-shell">
      <div className="scifi-bg" />
      <header className="app-header">
        <div className="app-logo display">
          🎬 <span>CINE<span className="gold">PLEX</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="user-chip">
            Xin chào, <b>{user.fullName}</b> · {user.role}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid rgba(212,163,60,0.3)',
              color: 'var(--cream-dim)',
              padding: '8px 14px',
              borderRadius: 20,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Đăng xuất
          </button>
        </div>
      </header>
      <SeatMap showtimeId={1} />
    </div>
  );
}
