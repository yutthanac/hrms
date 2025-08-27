import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeadSidebar from "../../../Component/Head/HeadSidebar";
import "./EmployeeProgress.css";

const TASK_STORAGE_KEY = "employeeTasks";
const STORAGE_KEY_HEAD_PROGRESS = "headProgress";

export default function EmployeeProgress() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem(TASK_STORAGE_KEY)) || {};
    const tasks = allTasks[id] || [];

    const headProgress = JSON.parse(localStorage.getItem(STORAGE_KEY_HEAD_PROGRESS)) || {};
    const progressForEmployee = headProgress[id] || {};

    if (tasks.length === 0) {
      setData(null);
      return;
    }

    // รวมงานกับความคืบหน้าจาก headProgress (key เป็น index ของงาน)
    const mergedTasks = tasks.map((task, index) => {
      return {
        ...task,
        ...progressForEmployee[index], // progress, percent, updatedAt ที่พนักงานส่ง
      };
    });

    const empName = mergedTasks[0]?.assignedToName || id;
    const empPosition = mergedTasks[0]?.position || "พนักงาน";

    setData({
      id,
      name: empName,
      position: empPosition,
      tasks: mergedTasks,
    });
  }, [id]);

  if (data === null) {
    return (
      <div className="ep-layout-container">
        <HeadSidebar />
        <main className="ep-main-content">
          <button className="ep-btn-back" onClick={() => navigate(-1)}>← ย้อนกลับ</button>
          <p>ไม่พบข้อมูลงานของพนักงานคนนี้</p>
        </main>
      </div>
    );
  }

  function handleDeleteTask(taskIndex) {
    if (!window.confirm("คุณแน่ใจว่าจะลบงานนี้ใช่ไหม? งานจะถูกยกเลิกและพนักงานจะได้รับแจ้งเตือน")) return;

    const allTasks = JSON.parse(localStorage.getItem(TASK_STORAGE_KEY)) || {};
    const employeeTasks = allTasks[id] || [];

    const removedTaskTitle = employeeTasks[taskIndex]?.taskSummary || "งานนี้";

    employeeTasks.splice(taskIndex, 1);
    allTasks[id] = employeeTasks;
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(allTasks));

    const headProgress = JSON.parse(localStorage.getItem(STORAGE_KEY_HEAD_PROGRESS)) || {};
    if (headProgress[id]) {
      delete headProgress[id][taskIndex];
      localStorage.setItem(STORAGE_KEY_HEAD_PROGRESS, JSON.stringify(headProgress));
    }

    const NOTIF_STORAGE_KEY = `employeeNotifications_${id}`;
    const existingNotifs = JSON.parse(localStorage.getItem(NOTIF_STORAGE_KEY)) || [];

    const newNotification = {
      id: Date.now(),
      type: 'งานถูกยกเลิก',
      title: `งานถูกยกเลิก: ${removedTaskTitle}`,
      message: `งาน "${removedTaskTitle}" ได้ถูกยกเลิกโดยหัวหน้า`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      link: `/employee/mywork`,
    };

    existingNotifs.unshift(newNotification);
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(existingNotifs));

    setData(prevData => ({
      ...prevData,
      tasks: employeeTasks,
    }));
  }

  // ฟังก์ชันสำหรับแสดงสถานะตามเปอร์เซ็นต์ความคืบหน้า
  const displayStatus = (task) => {
    if (task.percent && task.percent > 0) return "กำลังทำ";
    return task.status || "ยังไม่เริ่ม";
  };

  return (
    <div className="ep-layout-container">
      <HeadSidebar />
      <main className="ep-main-content">
        <div className="ep-header-buttons">
          <button className="ep-btn-back" onClick={() => navigate(-1)}>← ย้อนกลับ</button>
          <button className="ep-btn-assign" onClick={() => navigate(`/head/employee/${id}/add-work`)}>มอบหมายงาน</button>
        </div>

        <h3 className="ep-header-title">ความคืบหน้างาน: {data.name}</h3>
        <p className="ep-emp-position"><strong>ตำแหน่ง:</strong> {data.position}</p>

        {data.tasks.map((task, index) => (
          <div className="ep-progress-card" key={index}>
            <p><strong>งานที่ {index + 1}:</strong> {task.taskSummary}</p>

            <div className="ep-progress-bar">
              <div
                className="ep-progress-fill"
                style={{ width: `${task.percent || 0}%` }}
              >
                {task.percent || 0}%
              </div>
            </div>

            <p><strong>ความคืบหน้า:</strong> {task.progress || "ยังไม่ได้รายงาน"}</p>
            <p><strong>กำหนดส่ง:</strong> {task.deadline ? new Date(task.deadline).toLocaleString() : '-'}</p>
            <p><strong>สถานะ:</strong> {displayStatus(task)}</p>

            <button className="ep-btn-remove-task" onClick={() => handleDeleteTask(index)}>
              ลบงานนี้
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}
