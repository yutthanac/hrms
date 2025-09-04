// src/pages/pageHead/HeadDashboard.jsx
import React from 'react';
import HeadSidebar from '../../../Component/Head/HeadSidebar';
import ProfilePopover from '../../../Component/common/ProfilePopover/ProfilePopover'; // ✅ ใช้ไฟล์รวมใหม่
import '../../../../App.css';
import dayjs from 'dayjs';
import './HeadDashboardPage.css';

const HeadDashboard = () => {
  // ✅ ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    localStorage.clear(); // เคลียร์ token/user
    window.location.href = '/login'; // กลับไปหน้า login
  };

  // ✅ ดึงข้อมูลหัวหน้าจาก localStorage (ถ้าไม่มี ใช้ค่า default)
  const headUser = JSON.parse(localStorage.getItem('user')) || {
    name: 'นายธนพล จักกลาง',
    position: 'หัวหน้าแผนก',
    department: 'ฝ่ายผลิต',
    teamCount: 12,
    profilePic: '/default.jpg',
  };

  // ✅ ข้อมูลวันลา (mock หรือจะดึงจาก backend ก็ได้)
  const headLeaveData = {
    maxLeavePerYear: 30,
    totalUsedLeave: 12,
    usedLeaveThisMonth: 2,
  };

  const { maxLeavePerYear, totalUsedLeave, usedLeaveThisMonth } = headLeaveData;
  const remainingLeave = maxLeavePerYear - totalUsedLeave;
  const currentMonthLabel = dayjs().format('MMMM YYYY');

  return (
    <div className="layout-container">
      {/* Sidebar ฝั่งซ้าย */}
      <div className="sidebar">
        <HeadSidebar />
      </div>

      {/* Content ฝั่งขวา */}
      <div className="content-area">
        {/* มุมขวาบน: โปรไฟล์ + logout */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
          <ProfilePopover
            userId={localStorage.getItem('userId')}
            role="head"
            onLogout={handleLogout}
          />
        </div>

        <main className="main-content">
          <h1 className="textDashboard">แดชบอร์ดหัวหน้าแผนก</h1>

          {/* การ์ดแสดงข้อมูลวันลา */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="card-leave-summary">
              <h2>ภาพรวมปี</h2>
              <p>สิทธิวันลาต่อปี: {maxLeavePerYear} วัน</p>
              <p>ใช้ไปแล้ว: {totalUsedLeave} วัน</p>
              <p className="text-green-600 font-bold">วันลาที่เหลือ: {remainingLeave} วัน</p>
            </div>

            <div className="card-leave-summary">
              <h2>เดือน {currentMonthLabel}</h2>
              <p>ลาทั้งหมดเดือนนี้: {usedLeaveThisMonth} ครั้ง</p>
            </div>
          </div>

          {/* ข่าวสาร */}
          <section style={{ marginTop: '2rem' }}>
            <h2>ข่าวสารบริษัท</h2>
            <p>พื้นที่สำหรับแสดงข่าวสารและลิงก์สื่อต่าง ๆ ของบริษัทในอนาคต</p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HeadDashboard;
