import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './RequestLeavePageHead.css';
import HeadSidebar from '../../../Component/Head/HeadSidebar';

const leaveTypes = [
  'ลาพักร้อน',
  'ลาป่วย',
  'ลากิจส่วนตัว',
  'ลาคลอดบุตร',
  'ลาพักร้อนลากิจเพื่อนเดินทางไปต่างประเทศ',
  'ลาอุปสมบทหรือลาไปประกอบพิธีฮัจย์',
  'การลาไปฝึกอบรม',
  'ลาเข้ารับเลือกหรือเข้ารับการเตรียมพล',
];

const RequestLeavePage = () => {
  const navigate = useNavigate();
  const location  = useLocation(); 
  const isHead    = location.pathname.startsWith('/head');

   const dashboardPath = isHead ? '/head/dashboard' : '/employee/dashboard';
  const [form, setForm] = useState({
    employeeId: '',
    date: '',
    name: '',
    position: '',
    leaveType: '',
    fromDate: '',
    toDate: '',
    totalDays: '',
    contact: '',
    phone: '',
    delegate: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('ส่งคำขอลาเรียบร้อย');
    // เพิ่ม logic ส่งข้อมูลไป backend/Firebase ได้ที่นี่
  };


  

  return (
    <main className="main-container">
      <HeadSidebar/>
      <div className="leave-form-container">
        <form className="leave-form-box" onSubmit={handleSubmit}>
         <button
            type="button"
            className="back-button"
            onClick={() => navigate(dashboardPath)}
          >
            ← ย้อนกลับ
          </button>
          <h2>HRMS</h2>

          <div className="right">
            วันที่{' '}
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <p>
            <strong>เรื่อง:</strong> ขออนุญาต{form.leaveType || 'ลาพักร้อน'}
          </p>

          <p>
            ข้าพเจ้า{' '}
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="ชื่อ-นามสกุล"
            />{' '}
            ตำแหน่ง{' '}
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="ตำแหน่งงาน"
            />
          </p>

          <p>
            รหัสพนักงาน{' '}
            <input
              type="text"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              placeholder="เลขพนักงาน"
            />
            {' '}ขอลา{' '}
            <select
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
            >
              <option value="">-- เลือกประเภทการลา --</option>
              {leaveTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </p>

          <p>
            ตั้งแต่วันที่{' '}
            <input
              type="date"
              name="fromDate"
              value={form.fromDate}
              onChange={handleChange}
            />{' '}
            ถึงวันที่{' '}
            <input
              type="date"
              name="toDate"
              value={form.toDate}
              onChange={handleChange}
            />{' '}
            มีกำหนด{' '}
            <input
              type="text"
              name="totalDays"
              value={form.totalDays}
              onChange={handleChange}
              style={{ width: '60px' }}
            />{' '}
            วัน (วันทำการ)
          </p>

          <p>
            ในระหว่างลาติดต่อข้าพเจ้าได้ที่{' '}
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="ที่อยู่/อีเมล"
            />{' '}
            เบอร์โทรศัพท์{' '}
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </p>

          <p>
            ขอมอบหมายงานให้{' '}
            <input
              type="text"
              name="delegate"
              value={form.delegate}
              onChange={handleChange}
              placeholder="ชื่อผู้รับมอบหมาย"
            />
          </p>

          <button type="submit" className="submit-button">
            ส่งคำขอ
          </button>
        </form>
      </div>
    </main>
  );
};

export default RequestLeavePage;
