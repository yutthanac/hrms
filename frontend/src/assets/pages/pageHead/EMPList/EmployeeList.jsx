// src/pages/pageHead/EmployeeList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeadSidebar from '../../../Component/Head/HeadSidebar';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import api from '../../../../services/api';
import './EmployeeList.css';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ ดึงข้อมูล user จาก localStorage
  let headUser = null;
  try {
    headUser = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    console.warn('⚠️ localStorage.user parse error', e);
  }

  const headId = headUser?.id || null;

  useEffect(() => {
    if (!headId) {
      setError('❌ ไม่พบข้อมูลหัวหน้า');
      setLoading(false);
      return;
    }

    api
      .get(`/api/users/head/${headId}/employees`)
      .then((res) => {
        console.log("✅ employees from API:", res.data);
        setEmployees(res.data || []);
      })
      .catch((err) => {
        console.error('โหลดข้อมูลพนักงานล้มเหลว:', err);
        setError('โหลดข้อมูลพนักงานไม่สำเร็จ');
      })
      .finally(() => setLoading(false));
  }, [headId]);

  const filteredEmployees = employees.filter((emp) => {
    const keyword = searchTerm.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(keyword) ||
      String(emp.id).toLowerCase().includes(keyword)
    );
  });

  const handleExport = () => {
    const exportData = filteredEmployees.map((emp) => ({
      'รหัสพนักงาน': emp.id,
      'ชื่อพนักงาน': emp.name,
      'ตำแหน่ง': emp.role_name,
      'แผนก': emp.department_name,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'พนักงาน');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'employee_list.xlsx');
  };

  if (loading) return <div>⏳ กำลังโหลดข้อมูลพนักงาน...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="emp-list-container">
      <HeadSidebar />

      <div className="emp-list-main">
        <button className="btn-back" onClick={() => navigate(-1)}>← กลับ</button>

        <div className="top-bar">
          <input
            type="text"
            placeholder="ค้นหาชื่อหรือรหัสพนักงาน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="btn-export" onClick={handleExport}>📥 Export Excel</button>
        </div>

        <table className="emp-table">
          <thead>
            <tr>
              <th>รหัสพนักงาน</th>
              <th>ชื่อ</th>
              <th>ตำแหน่ง</th>
              <th>แผนก</th>
              <th>ความคืบหน้างาน</th>
              <th>เพิ่มงาน</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td
                  className="link-name"
                  onClick={() => navigate(`/head/employee/${emp.id}`)}
                >
                  {emp.name}
                </td>
                <td>{emp.role_name}</td>
                <td>{emp.department_name}</td>
                <td>
                  <button
                    className="btn-progress"
                    onClick={() => navigate(`/head/employee/${emp.id}/progress`)}
                  >
                    ดูความคืบหน้า
                  </button>
                </td>
                <td>
                  <button
                    className="btn-add-task"
                    onClick={() => navigate(`/head/employee/${emp.id}/add-work`)}
                  >
                    เพิ่มงาน
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
