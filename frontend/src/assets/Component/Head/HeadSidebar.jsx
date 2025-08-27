import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./HeadSidebar.css";
import { FaChartPie } from "react-icons/fa";

const HeadSidebar = ({ unreadCount = 0 }) => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <h2>หัวหน้าแผนก</h2>

      <nav className="sidebar-menu">
        <ul>
          <li onClick={() => navigate("/head/dashboard")}>🏠 Dashboard</li>
          <li onClick={() => navigate("/head/profile")}>👤 ข้อมูลส่วนตัว</li>
          <li onClick={() => navigate("/head/employee-list")}>👥 ทีมงาน</li>
          <li onClick={() => navigate("/head/request-leave")}>📝 ยื่นขอลา</li>
          <li onClick={() => navigate("/head/leave-approvals")}>✅ อนุมัติการลา</li>
          <li onClick={() => navigate("/head/delegate-shift")}>🔄 มอบหมายงานแทน</li>
          <li onClick={() => navigate("/head/schedule")}>📅 จัดตารางการทำงาน</li>

          <li>
            <NavLink
              to="/head/leave-stats"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaChartPie /> <span>สถิติการลา</span>
            </NavLink>
          </li>

          <li onClick={() => navigate("/head/notifications")}>
            🔔 แจ้งเตือน
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </li>

          <li className="logout" onClick={() => navigate("/login")}>
            🔴 ออกจากระบบ
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default HeadSidebar;
