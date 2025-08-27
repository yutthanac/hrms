import React, { useState, useEffect } from 'react';
import EmployeeSidebar from '../../../Component/Employee/EmployeeSidebar';
import ProfilePopover from '../../../Component/common/ProfilePopover/ProfilePopover';
import '../../../../App.css';
import dayjs from 'dayjs';
import axios from 'axios';

const EmployeeDashboard = () => {
  const [employeeUser, setEmployeeUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ดึง user id จาก localStorage (สมมติเก็บ id ตอน login)
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.id) {
      setError('ไม่พบข้อมูลผู้ใช้ในระบบ');
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${storedUser.id}`);
        setEmployeeUser(res.data);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>กำลังโหลดข้อมูลผู้ใช้...</div>;
  if (error) return <div>{error}</div>;
  if (!employeeUser) return <div>ไม่มีข้อมูลผู้ใช้</div>;

  // ข้อมูลวันลาสมมติ ถ้าไม่ได้เก็บในฐานข้อมูลจริง ต้องเขียน API เพิ่ม
  const maxLeavePerYear = 15;
  const totalUsedLeave = maxLeavePerYear - (employeeUser.leaveLeft ?? maxLeavePerYear);
  const remainingLeave = employeeUser.leaveLeft ?? maxLeavePerYear;
  const usedLeaveThisMonth = employeeUser.leaveUsedThisMonth ?? 0;
  const currentMonthLabel = dayjs().format("MMMM YYYY");

  return (
    <div className="layout-container">
      <EmployeeSidebar />

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
        <ProfilePopover userId={employeeUser.id} />
      </div>

      <main className="main-content">
        <h1 className="textDashboard">แดชบอร์ดพนักงาน</h1>

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

        <section style={{ marginTop: '2rem' }}>
          <h2>ข่าวสารบริษัท</h2>
          <p>พื้นที่สำหรับแสดงข่าวสารและลิงก์สื่อต่าง ๆ ของบริษัทในอนาคต</p>
        </section>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
