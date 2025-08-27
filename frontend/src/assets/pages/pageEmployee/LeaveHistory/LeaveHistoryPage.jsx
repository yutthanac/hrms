// src/assets/pages/pageEmployee/LeaveHistory/LeaveHistoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeSidebar from '../../../Component/Employee/EmployeeSidebar';
import './LeaveHistoryPage.css';  

const LeaveHistoryPage = () => {
  const navigate = useNavigate();
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = [
      { id: 1, type: 'ลาพักผ่อน', startDate: '2025-07-01', endDate: '2025-07-05', status: 'อนุมัติ', details: 'ลาพักผ่อนประจำปี' },
      { id: 2, type: 'ลาป่วย',    startDate: '2025-06-15', endDate: '2025-06-16', status: 'อนุมัติ', details: 'เป็นไข้' },
    ];
    setTimeout(() => {
      setLeaveHistory(mockData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="loading">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="leave-history-container">
      <EmployeeSidebar />

      <main className="leave-history-main">
        <button className="back-button" onClick={() => navigate('/employee/dashboard')}>
          ⬅ กลับไปหน้าหลัก
        </button>

        <h1>ประวัติการลาของคุณ</h1>

        {leaveHistory.length === 0 ? (
          <p>ยังไม่มีประวัติการลา</p>
        ) : (
          <ul className="leave-list">
            {leaveHistory.map((leave) => (
              <li
                key={leave.id}
                className={`leave-item ${selectedLeaveId === leave.id ? 'active' : ''}`}
                onClick={() =>
                  setSelectedLeaveId((prev) => (prev === leave.id ? null : leave.id))
                }
              >
                <strong>{leave.type}</strong> | {leave.startDate} ถึง {leave.endDate} | สถานะ: {leave.status}
                {selectedLeaveId === leave.id && (
                  <div className="leave-details">
                    <p><strong>ประเภทการลา:</strong> {leave.type}</p>
                    <p><strong>วันที่เริ่ม:</strong> {leave.startDate}</p>
                    <p><strong>วันที่สิ้นสุด:</strong> {leave.endDate}</p>
                    <p><strong>สถานะ:</strong> {leave.status}</p>
                    <p><strong>รายละเอียด:</strong> {leave.details}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default LeaveHistoryPage;
