// api/tasks.js
export const assignedTasksFromHead = [
  { id: 101, title: "ติดตั้งระบบกล้องวงจรปิด อาคาร A" },
  { id: 102, title: "ตรวจสอบระบบรักษาความปลอดภัย" },
  { id: 103, title: "วางแผนติดตั้งระบบไฟฟ้า อาคาร B" },
];

// api/notifications.js
export const notifications = [
  {
    id: "notif001",
    type: "งานใหม่",
    title: "ได้รับมอบหมายงานติดตั้งกล้อง",
    message: "หัวหน้ามอบหมายงาน ติดตั้งระบบกล้องวงจรปิด อาคาร A",
    date: "2025-07-20",
    read: false,
    taskId: 101,  // เชื่อมกับงาน
    link: "/employee/mywork?taskId=101",
  },
  // เพิ่มแจ้งเตือนอื่น ๆ
];
