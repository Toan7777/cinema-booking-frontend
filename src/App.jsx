import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import SeatMap from './components/SeatMap';

export default function App() {
  const [user, setUser] = useState(null);

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
