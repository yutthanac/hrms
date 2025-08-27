// src/pages/pageHead/HeadDashboard.jsx
import React from 'react';
import HeadSidebar from '../../../Component/Head/HeadSidebar';
import ProfilePopover from '../../../Component/common/ProfilePopOverHead/ProfilePopoverHead';
import '../../../../App.css';
import dayjs from 'dayjs';
import './HeadDashboardPage.css';

const HeadDashboard = () => {
  const headUser = JSON.parse(localStorage.getItem('user')) || {
    name: 'นายธนพล จักกลาง',
    position: 'หัวหน้าแผนก',
    department: 'ฝ่ายผลิต',
    teamCount: 12,
    profilePic: '/default.jpg',
  };

  // ข้อมูล leave ของหัวหน้า
  const headLeaveData = {
    maxLeavePerYear: 30,
    totalUsedLeave: 12, // รวมของทั้งปี
    usedLeaveThisMonth: 2, // เฉพาะเดือนปัจจุบัน
  };

  const { maxLeavePerYear, totalUsedLeave, usedLeaveThisMonth } = headLeaveData;
  const remainingLeave = maxLeavePerYear - totalUsedLeave;
  const currentMonthLabel = dayjs().format("MMMM YYYY");

  return (
    <div className="layout-container">
      <HeadSidebar />

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
        <ProfilePopover user={headUser} role="head" />
      </div>

      <main className="main-content">
        <h1 className="textDashbord">แดชบอร์ดหัวหน้าแผนก</h1>

        {/* ส่วนข้อมูลวันลา */}
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
      </main>
    </div>
  );
};

export default HeadDashboard;
