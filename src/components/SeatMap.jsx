import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

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
    pollRef.current = setInterval(loadSeats, 5000);
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
            ['https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=70', 'Hành Trình Vô Tận'],
            ['https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=70', 'Mật Mã Đêm Tối'],
            ['https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=70', 'Giấc Mơ Hollywood'],
            ['https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&q=70', 'Thành Phố Không Ngủ'],
          ].map(([src, title]) => (
            <div className="poster-card" key={title}>
              <img className="poster-img" src={src} alt={title} />
              <p>{title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
