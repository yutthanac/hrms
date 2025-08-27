// src/assets/pages/pageHead/DelegateShift/DelegateShiftPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import HeadSidebar from "../../../Component/Head/HeadSidebar";
import "./DelegateShiftPage.css";

// ————————— MOCK DATA (ดึงจาก API/Firestore แทนได้) —————————
const mockEmployees = [
  { id: "EMP‑001", name: "สมชาย ใจดี", position: "พนักงาน" },
  { id: "EMP‑002", name: "สุจิตรา ใจงาม", position: "พนักงาน" },
  { id: "EMP‑003", name: "ธีรเทพ ใจกล้า", position: "พนักงาน" },
  { id: "EMP‑004", name: "จันทรา พิไลศรี", position: "พนักงาน" },
];

export default function DelegateShiftPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [leaveEmp, setLeaveEmp] = useState("");
  const [shiftDate, setShiftDate] = useState(moment().format("YYYY-MM-DD"));
  const [shiftType, setShiftType] = useState("A");
  const [delegate, setDelegate] = useState("");
  const [note, setNote] = useState("");

  // เซ็ต leaveEmp จาก id เมื่อโหลด component
  useEffect(() => {
    if (id) {
      const found = mockEmployees.find(emp => emp.id === id);
      if (found) {
        setLeaveEmp(found.id);
      }
    }
  }, [id]);

  useEffect(() => setDelegate(""), [leaveEmp]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!leaveEmp || !delegate) {
      alert("กรุณาเลือกพนักงานทั้ง 2 คน");
      return;
    }
    console.log({ leaveEmp, shiftDate, shiftType, delegate, note });
    alert("บันทึกการมอบหมายเวรเรียบร้อย");
    navigate("/head/leave-approvals");
  };


  return (
    <div className="layout-container">
      <HeadSidebar />

      <main className="delegate-main">

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← ย้อนกลับ
        </button>

        <h1>มอบหมายเวรแทน</h1>
        <form className="delegate-form" onSubmit={handleSubmit}>
          {/* --- ผู้ลาที่ต้องหาแทน --- */}
          <label>พนักงานที่ลา</label>
          <select value={leaveEmp} onChange={(e) => setLeaveEmp(e.target.value)}>
            <option value="">— เลือกพนักงาน —</option>
            {mockEmployees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.id} {emp.name} ({emp.position})
              </option>
            ))}
          </select>

          {/* --- วัน & กะ --- */}
          <div className="row">
            <div>
              <label>วันที่</label>
              <input
                type="date"
                value={shiftDate}
                onChange={(e) => setShiftDate(e.target.value)}
              />
            </div>
            <div>
              <label>กะ</label>
              <select
                value={shiftType}
                onChange={(e) => setShiftType(e.target.value)}
              >
                <option value="A">กะเช้า (08:00‑16:00)</option>
                <option value="B">กะบ่าย (16:00‑00:00)</option>
                <option value="C">กะดึก (00:00‑08:00)</option>
              </select>
            </div>
          </div>

          {/* --- ผู้รับเวร --- */}
          <label>มอบหมายให้</label>
          <select value={delegate} onChange={(e) => setDelegate(e.target.value)}>
            <option value="">— เลือกพนักงานที่มาทำแทน —</option>
            {mockEmployees
              .filter((emp) => emp.id !== leaveEmp)
              .map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.id} {emp.name} ({emp.position})
                </option>
              ))}
          </select>

          {/* --- หมายเหตุ --- */}
          <label>หมายเหตุ (ถ้ามี)</label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button className="save-btn" type="submit">
            บันทึก & แจ้งเตือน
          </button>
        </form>
      </main>
    </div>
  );
}
