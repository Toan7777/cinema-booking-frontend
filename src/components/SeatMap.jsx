import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

function PosterRocket() {
  return (
    <svg viewBox="0 0 200 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="skyR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A0E2E" /><stop offset="100%" stopColor="#A8233B" />
        </linearGradient>
      </defs>
      <rect width="200" height="300" fill="url(#skyR)" />
      {[...Array(25)].map((_, i) => (
        <circle key={i} cx={(i * 37) % 200} cy={(i * 53) % 180} r={i % 4 === 0 ? 1.6 : 0.8} fill="#fff" opacity="0.7" />
      ))}
      <ellipse cx="100" cy="270" rx="40" ry="8" fill="#000" opacity="0.3" />
      <g>
        <polygon points="100,80 118,180 100,200 82,180" fill="#E8E3D8" />
        <polygon points="100,80 109,180 100,190" fill="#C9C2B0" />
        <polygon points="82,180 70,210 88,195" fill="#D4A33C" />
        <polygon points="118,180 130,210 112,195" fill="#D4A33C" />
        <circle cx="100" cy="115" r="9" fill="#2D9CDB" />
        <polygon points="88,200 100,235 112,200" fill="#D62F4E">
          <animate attributeName="opacity" values="1;0.5;1" dur="0.4s" repeatCount="indefinite" />
        </polygon>
      </g>
    </svg>
  );
}

function PosterNoir() {
  return (
    <svg viewBox="0 0 200 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="skyN" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A1420" /><stop offset="100%" stopColor="#2D9CDB" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect width="200" height="300" fill="url(#skyN)" />
      {[...Array(14)].map((_, i) => (
        <line key={i} x1={i * 16} y1="0" x2={i * 16 - 40} y2="300" stroke="#fff" strokeOpacity="0.04" strokeWidth="6" />
      ))}
      <rect x="0" y="190" width="200" height="110" fill="#06090F" />
      <rect x="20" y="120" width="26" height="80" fill="#0D1117" />
      <rect x="55" y="150" width="20" height="50" fill="#0D1117" />
      <rect x="140" y="100" width="30" height="100" fill="#0D1117" />
      <rect x="100" y="160" width="18" height="40" fill="#0D1117" />
      <circle cx="160" cy="60" r="22" fill="#F2E9D8" opacity="0.85" />
      <g opacity="0.9">
        <ellipse cx="100" cy="230" rx="3" ry="38" fill="#06090F" />
        <circle cx="100" cy="200" r="9" fill="#06090F" />
        <polygon points="84,250 100,240 116,250 110,300 90,300" fill="#06090F" />
      </g>
    </svg>
  );
}

function PosterHollywood() {
  return (
    <svg viewBox="0 0 200 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="skyH" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E2410" /><stop offset="100%" stopColor="#D4A33C" />
        </linearGradient>
      </defs>
      <rect width="200" height="300" fill="url(#skyH)" />
      <polygon points="0,220 200,220 200,300 0,300" fill="#1A1208" opacity="0.6" />
      {[...Array(7)].map((_, i) => (
        <circle key={i} cx={30 + i * 24} cy="190" r="4" fill="#F2E9D8">
          <animate attributeName="opacity" values="1;0.3;1" dur={`${1 + i * 0.15}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <rect x="20" y="190" width="160" height="6" fill="#1A1208" />
      <text x="100" y="130" textAnchor="middle" fontFamily="Bebas Neue, sans-serif" fontSize="34" fill="#1A1208" letterSpacing="2">STAR</text>
      <polygon points="100,40 108,62 132,62 112,76 120,98 100,84 80,98 88,76 68,62 92,62" fill="#F2E9D8" opacity="0.9" />
    </svg>
  );
}

function PosterCity() {
  return (
    <svg viewBox="0 0 200 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="skyC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E0A1E" /><stop offset="100%" stopColor="#5F49D4" />
        </linearGradient>
      </defs>
      <rect width="200" height="300" fill="url(#skyC)" />
      <circle cx="155" cy="55" r="26" fill="#F2E9D8" opacity="0.9" />
      {[
        [0, 150, 40, 150], [45, 110, 35, 190], [85, 170, 30, 130], [120, 90, 38, 210], [163, 140, 37, 160],
      ].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#0A0714" />
          {[...Array(Math.floor(h / 18))].map((_, j) => (
            <rect key={j} x={x + 5} y={y + 8 + j * 18} width="6" height="8" fill="#D4A33C" opacity={(i + j) % 3 === 0 ? 0.9 : 0.2} />
          ))}
        </g>
      ))}
    </svg>
  );
}
export default function SeatMap({ showtimeId }) {
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [lockExpiresAt, setLockExpiresAt] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [message, setMessage] = useState('');
  const pollRef = useRef(null);

  const loadSeats = async () => {
    const res = await api.get(`/showtimes/${showtimeId}/seats`);
    setSeats(res.data);
  };

  useEffect(() => {
    loadSeats();
    pollRef.current = setInterval(loadSeats, 8000);
    return () => clearInterval(pollRef.current);
  }, [showtimeId]);

  useEffect(() => {
    if (!lockExpiresAt) return;
    const timer = setInterval(() => {
      const secsLeft = Math.max(0, Math.floor((new Date(lockExpiresAt) - Date.now()) / 1000));
      setRemaining(secsLeft);
      if (secsLeft === 0) {
        clearInterval(timer);
        setMessage('Hết thời gian giữ ghế, vui lòng chọn lại.');
        setSelected([]);
        setLockExpiresAt(null);
        loadSeats();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lockExpiresAt]);

  const toggleSeat = (seat) => {
    if (lockExpiresAt) return;
    if (seat.status !== 'AVAILABLE') return;
    setSelected((prev) =>
      prev.includes(seat.seatId) ? prev.filter((id) => id !== seat.seatId) : [...prev, seat.seatId],
    );
  };

  const handleLock = async () => {
    setMessage('');
    try {
      const res = await api.post('/bookings/lock-seats', { showtimeId, seatIds: selected });
      setLockExpiresAt(res.data.expiresAt);
      setMessage('Giữ ghế thành công. Hoàn tất thanh toán trong 5 phút.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ghế đã bị giữ, vui lòng chọn lại.');
      setSelected([]);
      loadSeats();
    }
  };

  const handleConfirm = async () => {
    try {
      await api.post('/bookings/confirm', { showtimeId, seatIds: selected });
      setMessage('Đặt vé thành công! Cảm ơn bạn, hẹn gặp tại rạp.');
      setSelected([]);
      setLockExpiresAt(null);
      loadSeats();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Có lỗi khi xác nhận đặt vé.');
    }
  };

  const seatClass = (seat) => {
    if (selected.includes(seat.seatId)) return 'seat-btn seat-selected';
    if (seat.status === 'LOCKED') return 'seat-btn seat-locked';
    if (seat.status === 'BOOKED') return 'seat-btn seat-booked';
    return 'seat-btn seat-available';
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div>
      <div className="movie-banner">
        <span className="badge">Suất #{showtimeId}</span>
        <div>
          <h3>Avengers: Doomsday</h3>
          <p>Phòng 1 · 19:00 · 75.000đ / ghế</p>
        </div>
      </div>

      <div className="screen-curve" />
      <div className="screen-label">Màn hình</div>

      <div className="legend">
        <span className="legend-item"><span className="legend-seat seat-available" /> Trống</span>
        <span className="legend-item"><span className="legend-seat seat-locked" /> Đang giữ</span>
        <span className="legend-item"><span className="legend-seat seat-booked" /> Đã đặt</span>
        <span className="legend-item"><span className="legend-seat seat-selected" /> Bạn chọn</span>
      </div>

      <div className="seat-grid">
        {seats.map((seat) => (
          <button
            key={seat.seatId}
            disabled={(seat.status !== 'AVAILABLE' && !selected.includes(seat.seatId)) || !!lockExpiresAt}
            onClick={() => toggleSeat(seat)}
            title={seat.seatType}
            className={seatClass(seat)}
          >
            {seat.rowLabel}{seat.colNumber}
          </button>
        ))}
      </div>

      {message && <div className="message-banner">{message}</div>}

      <div className="action-bar">
        {!lockExpiresAt ? (
          <>
            <span style={{ color: 'var(--cream-dim)', fontSize: 13 }}>
              {selected.length} ghế đã chọn{selected.length > 0 && ` · ${(selected.length * 75000).toLocaleString('vi-VN')}đ`}
            </span>
            <button className="btn-primary" style={{ width: 'auto', padding: '12px 28px' }} onClick={handleLock} disabled={selected.length === 0}>
              Giữ ghế
            </button>
          </>
        ) : (
          <>
            <span className="timer-box">{fmt(remaining)}</span>
            <button className="btn-primary" style={{ width: 'auto', padding: '12px 28px' }} onClick={handleConfirm}>
              Xác nhận & thanh toán
            </button>
          </>
        )}
      </div>

      <div className="now-showing">
        <div className="section-title">Đang chiếu tại rạp</div>
        <div className="poster-row">
          {[
            ['https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80', 'Hành Trình Vô Tận'],
            ['https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80', 'Mật Mã Đêm Tối'],
            ['https://images.unsplash.com/photo-1519608425089-7f3bfa6f6bb8?w=400&q=80', 'Giấc Mơ Hollywood'],
            ['https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80', 'Thành Phố Không Ngủ'],
          ].map(([src, title]) => (
            <div className="poster-card" key={title}>
              <img
                src={src}
                alt={title}
                style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
              />
              <p>{title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
