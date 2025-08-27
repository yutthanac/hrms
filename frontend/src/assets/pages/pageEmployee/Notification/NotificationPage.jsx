import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationPage.css';
import EmployeeSidebar from '../../../Component/Employee/EmployeeSidebar';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUserId = 'emp001'; // สมมติว่าเป็นผู้ใช้ที่ล็อกอิน

  useEffect(() => {
    setTimeout(() => {
      const storedNotifs = JSON.parse(localStorage.getItem(`employeeNotifications_${currentUserId}`)) || [];

      // ✅ Mark ว่าอ่านแล้วทั้งหมด
      const updatedNotifs = storedNotifs.map(n => ({ ...n, read: true }));

      // ✅ เซฟกลับ localStorage และอัปเดต state
      localStorage.setItem(`employeeNotifications_${currentUserId}`, JSON.stringify(updatedNotifs));
      setNotifications(updatedNotifs);

      setLoading(false);
    }, 300);
  }, [currentUserId]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem(`employeeNotifications_${currentUserId}`, JSON.stringify(updated));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem(`employeeNotifications_${currentUserId}`);
  };

  // ✅ หลังจาก mark เป็น read แล้ว ตัวนี้จะคืนค่า 0
  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) return <div className="loading">กำลังโหลดแจ้งเตือน...</div>;

  return (
    <div className="notification-page-container">
      <EmployeeSidebar unreadCount={unreadCount} />

      <div className="notification-content">
        <div className="notification-header">
          <button className="back-button" onClick={() => navigate(-1)}>← กลับ</button>
          <h1>🔔 แจ้งเตือน</h1>
          {notifications.length > 0 && (
            <button className="clear-all-button" onClick={clearAllNotifications}>
              เคลียร์ทั้งหมด
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p>ไม่มีแจ้งเตือน</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className={`notification-item ${notif.read ? 'read' : 'unread'} ${expandedId === notif.id ? 'expanded' : ''}`}
              >
                <div className="notification-summary">
                  <div className="notification-left" onClick={() => toggleExpand(notif.id)}>
                    <span className="notification-type">{notif.type}</span>
                    <span className="notification-title">{notif.title}</span>
                    <span className="notification-date">{notif.date}</span>
                  </div>

                  <button
                    className="delete-button"
                    title="ลบแจ้งเตือน"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                  >
                    ❌
                  </button>
                </div>

                {expandedId === notif.id && (
                  <div className="notification-details">
                    <p>{notif.message}</p>
                    {notif.link && (
                      <button
                        className="view-button"
                        onClick={() => navigate(notif.link)}
                      >
                        เข้าดู
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
