// src/assets/pages/pageHead/HeadNotification/HeadNotificationPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeadSidebar from '../../../Component/Head/HeadSidebar';
import './HeadNotificationPage.css';

function HeadNotificationPage() {
  const navigate = useNavigate();
  const [notis, setNotis] = useState([]);

  /* โหลด mock data */
  useEffect(() => {

    const mock = [
      {
        id: 1,
        type: 'leave-request',
        title: 'คำขอลา – EMP‑002',
        details: 'สุจิตรา ใจงาม ขอ “ลาพักร้อน” 20‑22 ก.ค. 2025',
        date: '2025‑07‑15 09:12',
        read: false,
      },
      {
        id: 2,
        type: 'shift-accept',
        title: 'ยืนยันทำงานแทน – EMP‑003',
        details: 'ธีรเทพ ใจกล้า รับเวร B 18 ก.ค. 2025 เรียบร้อย',
        date: '2025‑07‑14 17:05',
        read: true,
      },
      {
        id: 3,
        type: 'news',
        title: 'ประกาศ: ซ้อมดับเพลิง 1 ส.ค.',
        details: 'บริษัทจะจัดซ้อมดับเพลิงและอพยพหนีไฟ เวลา 14:00 น.',
        date: '2025‑07‑13 08:30',
        read: true,
      },
    ];
    setNotis(mock);
  }, []);

  /* คลิกเปิด/ปิดรายละเอียด + mark read */
  const toggleOpen = (id) =>
    setNotis(n =>
      n.map(item =>
        item.id === id
          ? { ...item, open: !item.open, read: true }
          : item
      )
    );

  return (
    <div className="layout-container">
      <HeadSidebar />

      <main className="noti-main">
        <button className="back-btn" onClick={()=>navigate('/head/dashboard')}>
          ← กลับแดชบอร์ด
        </button>

        <h1>ศูนย์แจ้งเตือนหัวหน้า</h1>

        {notis.length === 0 ? (
          <p style={{marginTop:'2rem'}}>— ไม่มีแจ้งเตือน —</p>
        ) : (
          <ul className="noti-list">
            {notis.map(noti => (
              <li
                key={noti.id}
                className={`noti-item ${noti.read ? 'read' : 'unread'}`}
                onClick={()=>toggleOpen(noti.id)}
              >
                <div className="noti-summary">
                  <span className="noti-type">
                    {iconByType(noti.type)}
                  </span>
                  <span className="noti-title">{noti.title}</span>
                  <span className="noti-date">{noti.date}</span>
                </div>

                {/* รายละเอียดซ่อน/โชว์ */}
                {noti.open && (
                  <div className="noti-details">
                    {noti.details}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

/* ---------- helper icon ---------- */
function iconByType(t){
  switch(t){
    case 'leave-request': return '📝';
    case 'shift-accept':  return '✅';
    case 'news':          return '📰';
    default:              return '🔔';
  }
}
export default HeadNotificationPage;
