// src/pages/pageEmployee/MySchedulePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "./MySchedulePage.css";
import EmployeeSidebar from "../../../Component/Employee/EmployeeSidebar";

const weekdays = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];

const getMonthDates = (year, month) => {
  const dateList = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const offsetStart = (firstDay.getDay() + 6) % 7;
  const offsetEnd = 6 - ((lastDay.getDay() + 6) % 7);

  for (let i = -offsetStart; i <= lastDay.getDate() + offsetEnd; i++) {
    const d = new Date(year, month, i);
    dateList.push({
      date: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
      iso: d.toISOString().slice(0, 10),
      isCurrentMonth: d.getMonth() === month,
    });
  }

  return dateList;
};

const MySchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());

  useEffect(() => {
    const mockDataByMonth = {
      "2025-6": [
        { date: "2025-07-01", shift: "กะเช้า" },
        { date: "2025-07-02", shift: "กะบ่าย" },
        { date: "2025-07-04", shift: "หยุด" },
        { date: "2025-07-07", shift: "กะดึก" },
      ],
    };
    const key = `${currentYear}-${currentMonth}`;
    setSchedule(mockDataByMonth[key] || []);
  }, [currentYear, currentMonth]);

  const dates = getMonthDates(currentYear, currentMonth);

  const getShiftForDate = (isoDate) => {
    const entry = schedule.find((s) => s.date === isoDate);
    return entry ? entry.shift : "";
  };

  const years = [];
  const yearNow = dayjs().year();
  for (let y = yearNow - 5; y <= yearNow + 5; y++) {
    years.push(y);
  }

  return (
    <div className="page-layout">
      <EmployeeSidebar />
      <main className="main-content">
        <div className="top-bar">

          <div className="picker-bar">
            <label>
              เดือน:
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                aria-label="เลือกเดือน"
              >
                {dayjs.months().map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <label>
              ปี:
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                aria-label="เลือกปี"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="calendar-container">
          <div className="calendar">
            <div className="calendar-header">
              {weekdays.map((day, index) => (
                <div key={index} className="calendar-cell header-cell">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {dates.map((d, index) => (
                <div
                  key={index}
                  className={`calendar-cell ${!d.isCurrentMonth ? "dimmed" : ""}`}
                  title={getShiftForDate(d.iso) ? `เวร: ${getShiftForDate(d.iso)}` : ""}
                >
                  <div className="date-label">{d.date}</div>
                  <div className="shift">{getShiftForDate(d.iso)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MySchedulePage;
