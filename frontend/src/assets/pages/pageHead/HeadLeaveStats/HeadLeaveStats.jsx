import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import "dayjs/locale/th";
import localeData from "dayjs/plugin/localeData";
import { motion } from "framer-motion";
import HeadSidebar from "../../../Component/Head/HeadSidebar";
import "./HeadLeaveStats.css";

// เปิดใช้ภาษาไทย
dayjs.extend(localeData);
dayjs.locale("th");

// ฟังก์ชันแปลงชื่อเดือนและปีเป็นภาษาไทย
const formatThaiMonth = (dateStr) => {
  const d = dayjs(dateStr);
  const month = d.format("MMMM");       // เช่น กรกฎาคม
  const year = d.year() + 543;          // แปลง ค.ศ. เป็น พ.ศ.
  return `${month} ${year}`;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

// ข้อมูลจำลองสถิติการลาแยกตามเดือน
const leaveStatsByMonth = {
  "2025-07": {
    leaveData: [
      { name: "ลากิจ", value: 5 },
      { name: "ลาป่วย", value: 3 },
      { name: "ลาพักร้อน", value: 4 },
    ],
    barData: [
      { name: "ยุทธนา", leave: 5 },
      { name: "ฐานุพงศ์", leave: 4 },
      { name: "ปลายปลาย", leave: 3 },
    ],
  },
  "2025-08": {
    leaveData: [
      { name: "ลากิจ", value: 7 },
      { name: "ลาป่วย", value: 4 },
      { name: "ลาพักร้อน", value: 4 },
    ],
    barData: [
      { name: "ยุทธนา", leave: 6 },
      { name: "ฐานุพงศ์", leave: 5 },
      { name: "ปลายปลาย", leave: 4 },
    ],
  },
  "2025-09": {
    leaveData: [
      { name: "ลากิจ", value: 2 },
      { name: "ลาป่วย", value: 3 },
      { name: "ลาพักร้อน", value: 1 },
    ],
    barData: [
      { name: "ยุทธนา", leave: 2 },
      { name: "ฐานุพงศ์", leave: 3 },
      { name: "ปลายปลาย", leave: 1 },
    ],
  },
};

export default function HeadLeaveStats() {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));

  const { leaveData = [], barData = [] } = leaveStatsByMonth[selectedMonth] || {};

  const totalLeave = barData.reduce((sum, item) => sum + item.leave, 0);
  const averageLeave = barData.length > 0 ? (totalLeave / barData.length).toFixed(2) : 0;

  const handleExportCSV = () => {
    const rows = [["ชื่อ", "จำนวนวันลา"], ...barData.map(item => [item.name, item.leave])];
    const BOM = "\uFEFF"; // แก้ปัญหาภาษาไทยเพี้ยน
    const csvContent = BOM + rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `leave_stats_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white">
      <HeadSidebar />

      <div className="main-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-4 bg-white text-black shadow flex justify-between items-center"
        >
          <div>
            <h1 className="text-xl font-bold">
              สถิติการลาในแผนก — {formatThaiMonth(selectedMonth)}
            </h1>
            <div className="flex gap-4 text-sm mt-2">
              <span>จำนวนลาทั้งหมด: {totalLeave} วัน</span>
              <span>ลาเฉลี่ยต่อคน: {averageLeave} วัน</span>
              <span>คนที่ลาบ่อย: {barData[0]?.name || "-"}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <button
              onClick={handleExportCSV}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Export CSV
            </button>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="chart-container">
          {/* Pie Chart */}
          <div className="chart-left">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                  dataKey="value"
                >
                  {leaveData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute bottom-4">
              <button
                className="text-blue-700 underline"
                onClick={() => setShowDetails((prev) => !prev)}
              >
                {showDetails ? "ซ่อนรายละเอียด ▲" : "ดูรายละเอียด ▼"}
              </button>
              {showDetails && (
                <ul className="mt-2 text-sm text-black">
                  {leaveData.map((item) => (
                    <li key={item.name}>
                      {item.name}: {item.value} ครั้ง
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="chart-right">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leave" fill="#4fc3f7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
