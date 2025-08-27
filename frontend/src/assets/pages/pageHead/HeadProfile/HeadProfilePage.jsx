// src/pages/pageHead/HeadProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeadSidebar from '../../../Component/Head/HeadSidebar';
import './HeadProfilePage.css';
import picHead from '../../../pic/pon.jpg';

const mockProfileData = {
  workingStatus: 'กำลังปฏิบัติงาน',
  startDate: '2020-01-15',
  position: 'หัวหน้าแผนก',
  department: 'ฝ่ายบุคคล',
  nameTH: 'ธนพล จักรกลาง',
  nameEN: 'Thanapon Jakklang',
  birthday: '1985-07-20',
  gender: 'หญิง',
  bloodType: 'O',
  nationality: 'ไทย',
  religion: 'พุทธ',
  ethnicity: 'ไทย',
  height: 165,
  weight: 55,
  siblings: 2,
  disability: 'ไม่มี',
  specialAbility: 'ภาษาอังกฤษ, Excel ขั้นสูง',
  homeAddress: {
    houseNo: '123',
    road: 'สุขุมวิท',
    district: 'บางนา',
    province: 'กรุงเทพฯ',
    postalCode: '10260',
  },
  contactAddress: {
    phone: '080-123-4567',
    email: 'srisuda.hr@example.com',
  },
  education: {
    degree: 'ปริญญาตรี',
    major: 'การจัดการทรัพยากรมนุษย์',
    year: '2550',
    gpa: '3.45',
  },
  guardian: {
    name: 'นางสมหญิง สายตรง',
    relation: 'มารดา',
  },
  otherInfo: 'ไม่มี',
};

const HeadProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    setProfile(mockProfileData);
    setPhone(mockProfileData.contactAddress.phone);
  }, []);

  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleSavePhone = () => {
    alert('บันทึกเบอร์โทรศัพท์เรียบร้อย');
    setProfile(prev => ({
      ...prev,
      contactAddress: { ...prev.contactAddress, phone }
    }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleRemoveFile = () => setFile(null);

  if (!profile) return <div className="loading">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="profile-container">
      <HeadSidebar />
      <main className="profile-main">
        <button className="back-button" onClick={() => navigate(-1)}>← กลับ</button>

        <h1>โปรไฟล์คุณ</h1>

        <div className="profile-header">
                  <div className="profile-user">
                    <img src={picHead} alt="Profile" className="profile-image" />
                  </div>
                </div>
        

        <section className="profile-section">
          <h2>ข้อมูลการทำงาน</h2>
          <div className="profile-grid">
            <div><strong>สถานะ:</strong> {profile.workingStatus}</div>
            <div><strong>เริ่มงาน:</strong> {profile.startDate}</div>
            <div><strong>ตำแหน่ง:</strong> {profile.position}</div>
            <div><strong>แผนก:</strong> {profile.department}</div>
          </div>
        </section>

        <section className="profile-section">
          <h2>ข้อมูลส่วนตัว</h2>
          <div className="profile-grid">
            <div><strong>ชื่อ (TH):</strong> {profile.nameTH}</div>
            <div><strong>ชื่อ (EN):</strong> {profile.nameEN}</div>
            <div><strong>วันเกิด:</strong> {profile.birthday}</div>
            <div><strong>เพศ:</strong> {profile.gender}</div>
            <div><strong>กรุ๊ปเลือด:</strong> {profile.bloodType}</div>
            <div><strong>สัญชาติ:</strong> {profile.nationality}</div>
            <div><strong>ศาสนา:</strong> {profile.religion}</div>
            <div><strong>เชื้อชาติ:</strong> {profile.ethnicity}</div>
            <div><strong>ส่วนสูง:</strong> {profile.height} ซม.</div>
            <div><strong>น้ำหนัก:</strong> {profile.weight} กก.</div>
            <div><strong>จำนวนพี่น้อง:</strong> {profile.siblings}</div>
            <div><strong>ความพิการ:</strong> {profile.disability}</div>
            <div><strong>ความสามารถพิเศษ:</strong> {profile.specialAbility}</div>
          </div>
        </section>

        <section className="profile-section">
          <h2>ที่อยู่บ้าน</h2>
          <div className="profile-grid">
            <div>{profile.homeAddress.houseNo} {profile.homeAddress.road}</div>
            <div>{profile.homeAddress.district}, {profile.homeAddress.province} {profile.homeAddress.postalCode}</div>
          </div>
        </section>

        <section className="profile-section">
          <h2>ที่อยู่ติดต่อ</h2>
          <div className="profile-grid">
            <div>
              <label>โทรศัพท์:
                <input className="phone-input" value={phone} onChange={handlePhoneChange} />
              </label>
            </div>
            <div>อีเมล: {profile.contactAddress.email}</div>
          </div>
        </section>

        <section className="profile-section">
          <h2>การศึกษา</h2>
          <div className="profile-grid">
            <div><strong>วุฒิ:</strong> {profile.education.degree}</div>
            <div><strong>สาขา:</strong> {profile.education.major}</div>
            <div><strong>ปีที่จบ:</strong> {profile.education.year}</div>
            <div><strong>GPA:</strong> {profile.education.gpa}</div>
          </div>
        </section>

        <section className="profile-section">
          <h2>ผู้ปกครอง</h2>
          <div className="profile-grid">
            <div><strong>ชื่อ:</strong> {profile.guardian.name}</div>
            <div><strong>ความสัมพันธ์:</strong> {profile.guardian.relation}</div>
          </div>
        </section>

        <section className="profile-section">
          <h2>แนบไฟล์เอกสาร</h2>
          <input type="file" onChange={handleFileChange} />
          {file && (
            <div className="file-info">
              <p>ไฟล์: {file.name}</p>
              <button className="remove-file-btn" onClick={handleRemoveFile}>ลบไฟล์</button>
            </div>
          )}
        </section>

        <button className="save-phone-btn" onClick={handleSavePhone}>บันทึกเบอร์โทรศัพท์</button>
      </main>
    </div>
  );
};

export default HeadProfilePage;
