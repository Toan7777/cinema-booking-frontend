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
        <span className="user-chip">
          Xin chào, <b>{user.fullName}</b> · {user.role}
        </span>
      </header>
      <SeatMap showtimeId={1} />
    </div>
  );
}
