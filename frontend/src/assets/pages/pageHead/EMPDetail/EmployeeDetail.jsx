// EmployeeDetail.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeDetail.css';
import testpic from '../../../pic/profile_emp.jpg';

// สมมติข้อมูลพนักงานมาแบบนี้ (ในโปรเจคจริงจะดึงจาก API/DB)
const employee = {
  id: 'emp003',
  photo: testpic,
  nameTH: 'นางสาวศรีสุดา สายตรง',
  nameEN: 'Srisuda Saitong',
  position: 'หัวหน้าแผนก',
  startDate: '2020-01-15',
  birthDate: '1985-07-20',
  gender: 'หญิง',
  bloodType: 'O',
  nationality: 'ไทย',
  religion: 'พุทธ',
  // ข้อมูลเพิ่มเติม
  email: 'srisuda.s@example.com',
  phone: '080-123-4567',
  address: '123/45 ถนนสุขสวัสดิ์ เขตบางคอแหลม กรุงเทพฯ',
  department: 'ฝ่ายบริหาร',
  education: 'ปริญญาตรี บริหารธุรกิจ',
  maritalStatus: 'โสด',
};

const EmployeeDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="detail-container">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← ย้อนกลับ
      </button>

      <h1 className="title">ข้อมูลโปรไฟล์หัวหน้าแผนก</h1>

      <div className="profile-card">
        <div className="photo-section">
          <img
            src={employee.photo}
            alt={`รูปพนักงาน ${employee.nameTH}`}
            className="profile-photo"
          />
        </div>

        <div className="info-section">
          <h2 className="section-title">ข้อมูลส่วนตัว</h2>
          <div className="info-row">
            <strong>ชื่อ:</strong> {employee.nameTH}
          </div>
          <div className="info-row">
            <strong>ชื่อภาษาอังกฤษ:</strong> {employee.nameEN}
          </div>
          <div className="info-row">
            <strong>ตำแหน่ง:</strong> {employee.position}
          </div>
          <div className="info-row">
            <strong>เริ่มงาน:</strong> {employee.startDate}
          </div>
          <div className="info-row">
            <strong>วันเกิด:</strong> {employee.birthDate}
          </div>
          <div className="info-row">
            <strong>เพศ:</strong> {employee.gender}
          </div>
          <div className="info-row">
            <strong>กรุ๊ปเลือด:</strong> {employee.bloodType}
          </div>
          <div className="info-row">
            <strong>สัญชาติ:</strong> {employee.nationality}
          </div>
          <div className="info-row">
            <strong>ศาสนา:</strong> {employee.religion}
          </div>
          <div className="info-row">
            <strong>อีเมล:</strong> {employee.email}
          </div>
          <div className="info-row">
            <strong>เบอร์โทรศัพท์:</strong> {employee.phone}
          </div>
          <div className="info-row">
            <strong>ที่อยู่:</strong> {employee.address}
          </div>
          <div className="info-row">
            <strong>แผนก:</strong> {employee.department}
          </div>
          <div className="info-row">
            <strong>การศึกษา:</strong> {employee.education}
          </div>
          <div className="info-row">
            <strong>สถานภาพสมรส:</strong> {employee.maritalStatus}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
