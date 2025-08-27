import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeadSidebar from '../../../Component/Head/HeadSidebar';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './EmployeeList.css';

const employeesData = [
  { id: 'emp001', name: 'สมชาย ใจดี', position: 'พนักงาน' },
  { id: 'emp002', name: 'สมหญิง สายตรง', position: 'พนักงาน' },
  { id: 'emp003', name: 'วิทยา ใจแกร่ง', position: 'พนักงาน' },
  { id: 'emp004', name: 'Yutthana chaithaisong', position: 'พนักงาน' },
];

const EmployeeList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employeesData.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const exportData = filteredEmployees.map((emp) => ({
      'รหัสพนักงาน': emp.id,
      'ชื่อพนักงาน': emp.name,
      'ตำแหน่ง': emp.position,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'พนักงาน');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'employee_list.xlsx');
  };

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
                <td>{emp.position}</td>
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
