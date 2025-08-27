// src/assets/pages/pageEmployee/Profile/ProfilePage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../../services/api';
import EmployeeSidebar from '../../../Component/Employee/EmployeeSidebar';
import './ProfilePage.css';
import picpro from '../../../pic/profile_emp.jpg';

/** หา userId ให้ทนทาน: ?userId=.. > localStorage.userId > localStorage.user.id */
const useUserId = () => {
  const { search } = useLocation();
  const qs = new URLSearchParams(search);
  const qId = Number(qs.get('userId'));
  if (!Number.isNaN(qId) && qId > 0) return qId;

  const rawId = localStorage.getItem('userId');
  if (rawId && rawId !== 'undefined' && rawId !== 'null') {
    const n = Number(rawId);
    if (!Number.isNaN(n) && n > 0) return n;
  }

  try {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      const obj = JSON.parse(rawUser);
      const n = Number(obj?.id ?? obj?.user?.id);
      if (!Number.isNaN(n) && n > 0) return n;
    }
  } catch {}
  return 0;
};

// helpers
const has = (v) =>
  v !== null && v !== undefined && String(v).trim() !== '' && v !== '-';

const val = (v, dash = '-') => (has(v) ? v : dash);

const fmtDateTH = (d) => {
  if (!has(d)) return '-';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '-';
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'long' }).format(dt);
};

const Row = ({ label, value, isDate }) =>
  has(value) ? (
    <div>
      <strong>{label}:</strong> {isDate ? fmtDateTH(value) : value}
    </div>
  ) : null;

export default function ProfilePage() {
  const navigate = useNavigate();
  const userId = useUserId();

  const [profile, setProfile] = useState(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // โหลดโปรไฟล์จาก backend
  useEffect(() => {
    if (!userId) {
      setError('ไม่พบผู้ใช้ที่ล็อกอิน');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    api
      .get(`/api/users/${userId}/profile`)
      .then((res) => {
        setProfile(res.data);
        setPhone(res.data?.contactAddress?.phone || res.data?.phone || '');
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'โหลดข้อมูลโปรไฟล์ไม่สำเร็จ');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSavePhone = () => {
    if (!userId || !has(phone)) return;
    setSaving(true);
    api
      .put(`/api/users/${userId}/profile/phone`, { phone })
      .then(() => {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                contactAddress: { ...prev.contactAddress, phone },
              }
            : prev
        );
        alert('บันทึกเบอร์โทรศัพท์เรียบร้อย');
      })
      .catch((err) => {
        alert(err.response?.data?.error || 'บันทึกเบอร์ไม่สำเร็จ');
      })
      .finally(() => setSaving(false));
  };

  const headerName = useMemo(
    () => profile?.full_name || profile?.nameTH || '-',
    [profile]
  );

  if (loading) return <div className="loading">กำลังโหลดข้อมูลโปรไฟล์...</div>;
  if (error) return <div className="loading error">{error}</div>;
  if (!profile) return null;

  // เตรียมข้อมูลแบบซ่อนถ้าไม่มี
  const workRows = [
    { label: 'สถานะ', value: profile.workingStatus },
    { label: 'เริ่มงาน', value: profile.startDate, isDate: true },
    { label: 'ตำแหน่ง', value: profile.position || profile.role_name },
    { label: 'หัวหน้าแผนก', value: profile.departmentHead },
  ];

  const personalRows = [
    { label: 'ชื่อ (TH)', value: profile.nameTH },
    { label: 'ชื่อ (EN)', value: profile.nameEN },
    { label: 'วันเกิด', value: profile.birthday, isDate: true },
    { label: 'เพศ', value: profile.gender },
    { label: 'กรุ๊ปเลือด', value: profile.bloodType },
    { label: 'สัญชาติ', value: profile.nationality },
    { label: 'ศาสนา', value: profile.religion },
    { label: 'เชื้อชาติ', value: profile.ethnicity },
    { label: 'ส่วนสูง', value: has(profile.height) ? `${profile.height} ซม.` : '' },
    { label: 'น้ำหนัก', value: has(profile.weight) ? `${profile.weight} กก.` : '' },
    { label: 'จำนวนพี่น้อง', value: has(profile.siblings) ? profile.siblings : '' },
    { label: 'ความพิการ', value: profile.disability },
    { label: 'ความสามารถพิเศษ', value: profile.specialAbility },
  ];

  const home = profile.homeAddress || {};
  const contact = profile.contactAddress || {};
  const education = profile.education || {};
  const parents = profile.parentGuardian || {};

  const showWork = workRows.some((r) => has(r.value));
  const showPersonal = personalRows.some((r) => has(r.value));
  const showHome =
    has(home.houseNo) ||
    has(home.village) ||
    has(home.alley) ||
    has(home.road) ||
    has(home.subdistrict) ||
    has(home.district) ||
    has(home.province) ||
    has(home.postalCode);

  const showContact =
    has(contact.houseNo) ||
    has(contact.village) ||
    has(contact.alley) ||
    has(contact.road) ||
    has(contact.subdistrict) ||
    has(contact.district) ||
    has(contact.province) ||
    has(contact.postalCode) ||
    has(contact.email) ||
    has(contact.phone || phone) ||
    has(profile.email);

  const showEdu =
    has(education.degree) ||
    has(education.major) ||
    has(education.year) ||
    has(education.gpa);

  const showParents =
    has(parents.father) || has(parents.mother) || has(parents.guardian);

  const showOther = has(profile.otherInfo);

  return (
    <div className="profile-container">
      <EmployeeSidebar />
      <main className="profile-main">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← กลับ
        </button>

        {/* HEADER */}
        <div className="profile-header">
          <div className="profile-user">
            <img
              src={profile.profile_pic || picpro}
              alt="Profile"
              className="profile-image"
            />
            <div className="profile-name-block">
              <h2>{headerName}</h2>
              <div className="muted">
                {val(profile.role_name)} • {val(profile.department_name)}
              </div>
              <div className="muted">{val(profile.email)}</div>
            </div>
          </div>
        </div>

        {/* ข้อมูลการทำงาน */}
        {showWork && (
          <section className="profile-section">
            <h2>ข้อมูลการทำงาน</h2>
            <div className="profile-grid">
              {workRows.map((r) => (
                <Row key={r.label} label={r.label} value={r.value} isDate={r.isDate} />
              ))}
            </div>
          </section>
        )}

        {/* ข้อมูลส่วนตัว */}
        {showPersonal && (
          <section className="profile-section">
            <h2>ข้อมูลส่วนตัว</h2>
            <div className="profile-grid">
              {personalRows.map((r) => (
                <Row key={r.label} label={r.label} value={r.value} isDate={r.isDate} />
              ))}
            </div>
          </section>
        )}

        {/* ที่อยู่บ้าน */}
        {showHome && (
          <section className="profile-section">
            <h2>ที่อยู่บ้าน</h2>
            <div className="profile-grid">
              <div>
                {val(home.houseNo)} {val(home.village, '')} {val(home.alley, '')}
              </div>
              <div>{val(home.road)}</div>
              <div>
                {val(home.subdistrict)} {val(home.district)} {val(home.province)}{' '}
                {val(home.postalCode)}
              </div>
            </div>
          </section>
        )}

        {/* ที่อยู่ติดต่อ + เบอร์แก้ไขได้ */}
        {showContact && (
          <section className="profile-section">
            <h2>ที่อยู่ติดต่อ</h2>
            <div className="profile-grid">
              {(has(contact.houseNo) || has(contact.village) || has(contact.alley)) && (
                <div>
                  {val(contact.houseNo)} {val(contact.village, '')}{' '}
                  {val(contact.alley, '')}
                </div>
              )}
              {has(contact.road) && <div>{contact.road}</div>}
              {(has(contact.subdistrict) ||
                has(contact.district) ||
                has(contact.province) ||
                has(contact.postalCode)) && (
                <div>
                  {val(contact.subdistrict)} {val(contact.district)}{' '}
                  {val(contact.province)} {val(contact.postalCode)}
                </div>
              )}

              {/* โทรศัพท์ (แก้ไขได้) */}
              <div>
                <label>
                  โทรศัพท์:
                  <input
                    className="phone-input"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={saving}
                    placeholder="กรอกเบอร์ติดต่อ"
                  />
                </label>
                <button
                  className="save-phone-btn"
                  onClick={handleSavePhone}
                  disabled={saving || !has(phone)}
                  style={{ marginLeft: 8 }}
                >
                  {saving ? 'กำลังบันทึก...' : 'บันทึกเบอร์โทรศัพท์'}
                </button>
              </div>

              {/* อีเมล */}
              <div>อีเมล: {val(contact.email || profile.email)}</div>
            </div>
          </section>
        )}

        {/* การศึกษา */}
        {showEdu && (
          <section className="profile-section">
            <h2>การศึกษา</h2>
            <div className="profile-grid">
              <Row label="วุฒิ" value={education.degree} />
              <Row label="สาขา" value={education.major} />
              <Row label="ปีที่จบ" value={education.year} />
              <Row label="GPA" value={education.gpa} />
            </div>
          </section>
        )}

        {/* บิดามารดา/ผู้ปกครอง */}
        {showParents && (
          <section className="profile-section">
            <h2>ข้อมูลบิดามารดาและผู้ปกครอง</h2>
            <div className="profile-grid">
              <Row label="บิดา" value={parents.father} />
              <Row label="มารดา" value={parents.mother} />
              <Row label="ผู้ปกครอง" value={parents.guardian} />
            </div>
          </section>
        )}

        {/* อื่น ๆ */}
        {showOther && (
          <section className="profile-section">
            <h2>ข้อมูลอื่นๆ</h2>
            <p>{profile.otherInfo}</p>
          </section>
        )}
      </main>
    </div>
  );
}
