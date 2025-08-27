// src/assets/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';
import logoImage from '../pic/logo_hrms.jpg';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });

      if (res.data?.ok && res.data?.user) {
  const user = res.data.user;

  // ✅ เก็บทั้ง object และ userId แยกไว้
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('userId', String(user.id));

  // ✅ ส่งไปหน้าตาม role
  switch (user.role_id) {
    case 4:
      navigate('/head/dashboard');
      break;
    case 5:
      navigate('/employee/dashboard');
      break;
    default:
      setError('สิทธิ์ของผู้ใช้ไม่ถูกต้อง');
  }
} else {
  setError(res.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
}

    } catch (err) {
      console.error('Login failed:', err);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <img src={logoImage} alt="HRMS Logo" className="logo" />
        <h2>เข้าสู่ระบบ HRMS</h2>

        <input
          type="text"
          placeholder="ชื่อผู้ใช้"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
