import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import HeadSidebar from '../../../Component/Head/HeadSidebar';
import './AddWorkPage.css';

const AddWorkPage = () => {
  const { id } = useParams();  // รหัสพนักงาน
  const navigate = useNavigate();
  const location = useLocation();
  const empName = location.state?.empName || 'พนักงาน';

  const [job, setJob] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (job && deadline) {
      // สร้าง id งานใหม่ (ใช้ timestamp)
      const newTaskId = Date.now();

      // สร้างงานใหม่ พร้อม id
      const newTask = {
        id: newTaskId,
        taskSummary: job,
        deadline,
        assignedTo: id,
        status: "ยังไม่เริ่ม",
        progress: 0,
        createdAt: new Date().toISOString()
      };

      // เก็บงานลง localStorage
      const TASK_STORAGE_KEY = 'employeeTasks';
      const allTasks = JSON.parse(localStorage.getItem(TASK_STORAGE_KEY)) || {};
      if (!allTasks[id]) allTasks[id] = [];
      allTasks[id].push(newTask);
      localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(allTasks));

      // สร้างแจ้งเตือนงานใหม่
      const NOTIF_STORAGE_KEY = `employeeNotifications_${id}`;
      const existingNotifs = JSON.parse(localStorage.getItem(NOTIF_STORAGE_KEY)) || [];

      const newNotification = {
        id: Date.now(),
        type: 'งานใหม่',
        title: `เพิ่มงานใหม่: ${job}`,
        message: `คุณได้รับมอบหมายงานใหม่: ${job} กำหนดส่งวันที่ ${new Date(deadline).toLocaleString()}`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        link: `/employee/mywork?taskId=${newTaskId}`  // ลิงก์ไปที่งานที่เพิ่มใหม่
      };

      existingNotifs.unshift(newNotification);
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(existingNotifs));

      // เคลียร์ฟอร์ม (ถ้าจะเพิ่มงานซ้ำ)
      setJob('');
      setDeadline('');

      // เด้งไปหน้าแจ้งเตือนของพนักงานคนนั้น
      navigate(-1);

    }
  };

  return (
    <div className="add-work-container">
      <HeadSidebar />

      <div className="main-content">
        <div className="work-form-wrapper">
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← กลับ
          </button>

          <h2 className="form-title">เพิ่มงานให้: {empName} (ID: {id})</h2>

          <form onSubmit={handleSubmit} className="work-form">
            <label htmlFor="job">รายละเอียดงาน</label>
            <input
              type="text"
              id="job"
              placeholder="เช่น จัดเรียงเอกสาร, ตรวจสอบสต๊อก"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              required
            />

            <label htmlFor="deadline">กำหนดส่งงาน</label>
            <input
              type="datetime-local"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />

            <button type="submit">บันทึกงาน</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWorkPage;
