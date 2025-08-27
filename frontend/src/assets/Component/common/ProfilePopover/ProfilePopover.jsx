import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ProfilePopover.css';
import picemp from '../../../pic/profile_emp.jpg';

export default function ProfilePopover({ userId }) {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const popRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      console.warn('⚠️ userId ว่างหรือ undefined');
      setUser(null);
      return;
    }
    setLoading(true);
    setError('');
    axios
      .get(`http://localhost:5000/api/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error('❌ ดึงข้อมูลผู้ใช้ล้มเหลว:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        popRef.current && !popRef.current.contains(e.target) &&
        toggleRef.current && !toggleRef.current.contains(e.target)
      ){
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName =
    user?.full_name ||
    (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'Guest');

  return (
    <div className="profile-pop-wrapper">
      <button
        ref={toggleRef}
        className={`profile-toggle ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        disabled={loading}
      >
        <span className="profile-name">
          {loading ? 'กำลังโหลด...' : error ? '—' : displayName}
        </span>
        <img src={user?.profile_pic || picemp} alt="avatar" />
      </button>

      {open && !loading && !error && user && (
  <div ref={popRef} className="profile-pop-card" role="dialog">
    <h4>ข้อมูลด่วน</h4>
    <p><strong>ชื่อ–นามสกุล:</strong> {user.full_name || '-'}</p>
    <p><strong>ตำแหน่ง:</strong> {user.role_name || '-'}</p>
    <p><strong>แผนก:</strong> {user.department_name || '-'}</p>
  </div>
)}

    </div>
  );
}
