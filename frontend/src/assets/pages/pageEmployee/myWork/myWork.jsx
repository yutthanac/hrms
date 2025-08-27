import React, { useState, useEffect } from "react";
import EmployeeSidebar from "../../../Component/Employee/EmployeeSidebar";
import "./myWork.css";

const TASK_STORAGE_KEY = "employeeTasks";
const STORAGE_KEY_PROGRESS = "myWorkProgress";
const STORAGE_KEY_HEAD_PROGRESS = "headProgress";

export default function MyWork() {
  const currentUserId = "emp001"; // กำหนดรหัสพนักงาน login จริง ๆ

  const [tasks, setTasks] = useState([]);
  const [progressData, setProgressData] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY_PROGRESS);
    return stored ? JSON.parse(stored) : {};
  });
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // โหลดงานจริงของพนักงานจาก localStorage
  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem(TASK_STORAGE_KEY)) || {};
    const myTasks = allTasks[currentUserId] || [];
    setTasks(myTasks);
  }, [currentUserId]);

  // ฟังก์ชันอัพเดตความคืบหน้า
  const updateProgress = (taskIndex, field, value) => {
    setProgressData((prev) => {
      const taskProgress = prev[taskIndex] || {
        progress: "",
        percent: 0,
        attachments: [],
      };
      return {
        ...prev,
        [taskIndex]: {
          ...taskProgress,
          [field]: value,
        },
      };
    });
  };

  const selectedTask = tasks[selectedTaskId];

  // ฟังก์ชันบันทึกความคืบหน้าพร้อมส่งไปหัวหน้า
  const handleSave = () => {
    if (selectedTaskId === null) {
      alert("กรุณาเลือกงานก่อนบันทึก");
      return;
    }

    // อัพเดต localStorage ฝั่งพนักงาน
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progressData));

    // อัพเดต localStorage ฝั่งหัวหน้า
    const storedHeadProgress = JSON.parse(localStorage.getItem(STORAGE_KEY_HEAD_PROGRESS)) || {};

    if (!storedHeadProgress[currentUserId]) {
      storedHeadProgress[currentUserId] = {};
    }

    // เก็บความคืบหน้าของงานที่เลือก (selectedTaskId)
    storedHeadProgress[currentUserId][selectedTaskId] = {
      taskSummary: selectedTask.taskSummary,
      ...progressData[selectedTaskId],
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY_HEAD_PROGRESS, JSON.stringify(storedHeadProgress));

    alert("บันทึกความคืบหน้าเรียบร้อย!");
  };

  return (
    <div className="layout-container">
      <EmployeeSidebar />

      <main className="main-content">
        <h1 className="textDashbord">ส่งความคืบหน้างานที่ได้รับมอบหมาย</h1>

        <div className="mywork-content">
          <div className="mywork-left">
            <ul className="task-list">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className={`task-item ${selectedTaskId === index ? "active" : ""}`}
                  onClick={() => setSelectedTaskId(index)}
                >
                  <strong>{task.taskSummary}</strong>
                  <span>{progressData[index]?.percent || 0}% เสร็จสมบูรณ์</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mywork-right">
            {selectedTask ? (
              <div className="task-detail">
                <button className="btn-back" onClick={() => setSelectedTaskId(null)}>
                  ← กลับ
                </button>
                <h3>{selectedTask.taskSummary}</h3>

                <label>
                  ความคืบหน้า:
                  <textarea
                    rows={6}
                    value={progressData[selectedTaskId]?.progress || ""}
                    onChange={(e) => updateProgress(selectedTaskId, "progress", e.target.value)}
                    placeholder="กรอกความคืบหน้า..."
                    className="task-textarea"
                  />
                </label>

                <label>
                  เปอร์เซ็นต์ความสำเร็จ: {progressData[selectedTaskId]?.percent || 0}%
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressData[selectedTaskId]?.percent || 0}
                    onChange={(e) =>
                      updateProgress(selectedTaskId, "percent", Number(e.target.value))
                    }
                  />
                </label>
                <button className="btn-submit" onClick={handleSave}>
                  บันทึกความคืบหน้า
                </button>
              </div>
            ) : (
              <p>กรุณาเลือกงานที่ต้องการส่งความคืบหน้าจากฝั่งซ้าย</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
