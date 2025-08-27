import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./EmployeeSidebar.css";

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // ใช้ userId ที่เหมาะสมตรงกับที่คุณใช้ใน localStorage
  const userId = "emp001";

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`employeeNotifications_${userId}`)) || [];
    const unread = stored.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, []);

  return (
    <aside className="sidebar">
      <h2>พนักงาน</h2>
      <nav className="sidebar-menu">
        <ul>
          <li onClick={() => navigate("/employee/dashboard")}>🏠 Dashboard</li>
          <li onClick={() => navigate("/employee/profile")}>👤 ข้อมูลส่วนตัว</li>

          <li>
            📊{" "}
            <NavLink
              to="/employee/mywork"
              className={({ isActive }) => `menu-link${isActive ? " active" : ""}`}
            >
              ส่งความคืบหน้างาน
            </NavLink>
          </li>

          <li onClick={() => navigate("/employee/leave-history")}>📆 ประวัติการลา</li>
          <li onClick={() => navigate("/employee/request-leave")}>📝 ยื่นขอลา</li>
          <li onClick={() => navigate("/employee/shift-requests")}>✅ คำขอให้ทำแทน</li>
          <li onClick={() => navigate("/employee/schedule")}>📅 ตารางงาน</li>

          <li onClick={() => navigate("/employee/notifications")} style={{ position: "relative" }}>
            🔔 แจ้งเตือน
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px"
                }}
              >
                {unreadCount}
              </span>
            )}
          </li>

          <li className="logout" onClick={() => navigate("/login")}>🔴 ออกจากระบบ</li>
        </ul>
      </nav>
    </aside>
  );
};

export default EmployeeSidebar;
