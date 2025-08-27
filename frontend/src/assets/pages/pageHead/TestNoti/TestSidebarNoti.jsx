import React, { useState, useEffect } from "react";
import HeadSidebar from "../../../Component/Head/HeadSidebar";
// แจ้งเตือนจำลอง (ฝั่งหัวหน้าแผนก)
const mockHeadNotifications = [
  { id: 1, message: "คำขอลาพักผ่อนของ A123 รออนุมัติ", read: false },
  { id: 2, message: "คำขอแทนเวรของ B456 ถูกยกเลิก", read: true },
  { id: 3, message: "คำขอแก้ไขตารางเวร C789", read: false },
];

const TestHeadSidebarNotification = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  // คำนวณจำนวนที่ยังไม่อ่านเมื่อ mount
  useEffect(() => {
    const unread = mockHeadNotifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <HeadSidebar unreadCount={unreadCount} />

      <div style={{ padding: "20px" }}>
        <h1>🔧 ทดสอบ Head Sidebar + Badge</h1>
        <p>มีแจ้งเตือนทั้งหมด: {mockHeadNotifications.length}</p>
        <p>ยังไม่ได้อ่าน: {unreadCount}</p>
      </div>
    </div>
  );
};

export default TestHeadSidebarNotification;
