import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShiftRequestsPage.css';
import EmployeeSidebar from '../../../Component/Employee/EmployeeSidebar';

const updateRequestStatus = async (id, status) => {
  // เรียกใช้ API จริงตรงนี้ เช่น Firebase, Express, etc.
  console.log(`Updating ID ${id} to status: ${status}`);
};

const ShiftRequestsPage = () => {
  const [shiftRequests, setShiftRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        requester: 'สมหญิง ใจงาม',
        date: '2025-07-10',
        shift: 'กลางวัน',
        reason: 'มีธุระด่วน',
        status: 'pending',
      },
      {
        id: 2,
        requester: 'ศักดิ์ชัย ยอดเยี่ยม',
        date: '2025-07-10',
        shift: 'กลางคืน',
        reason: 'ไม่สบาย',
        status: 'pending',
      },
      {
        id: 3,
        requester: 'อรุณี สายทอง',
        date: '2025-07-12',
        shift: 'กลางวัน',
        reason: 'ไปต่างจังหวัด',
        status: 'pending',
      },
    ];

    setTimeout(() => {
      setShiftRequests(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handleAccept = async (acceptedId) => {
    const acceptedRequest = shiftRequests.find(req => req.id === acceptedId);
    if (!acceptedRequest) return;

    const updatedRequests = shiftRequests.map(req => {
      if (req.id === acceptedId) {
        updateRequestStatus(req.id, 'accepted');
        return { ...req, status: 'accepted' };
      } else if (req.date === acceptedRequest.date && req.status === 'pending') {
        updateRequestStatus(req.id, 'rejected');
        return { ...req, status: 'rejected' };
      }
      return req;
    });

    setShiftRequests(updatedRequests);
  };

  const handleReject = async (id) => {
    updateRequestStatus(id, 'rejected');
    const updated = shiftRequests.map((req) =>
      req.id === id ? { ...req, status: 'rejected' } : req
    );
    setShiftRequests(updated);
  };

  return (
    <div className="shift-requests-container"> 
    <EmployeeSidebar />
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', color: '#e0e0e0' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'transparent',
          color: '#4fc3f7',
          border: '1px solid #4fc3f7',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          marginBottom: '1.5rem',
          cursor: 'pointer',
        }}
      >
        ← กลับ
      </button>

      <h2 style={{ marginBottom: '1.5rem', color: '#4fc3f7' }}>🔁 คำขอให้คุณทำงานแทน</h2>

      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : shiftRequests.length === 0 ? (
        <p>ยังไม่มีคำขอให้ทำแทนในขณะนี้</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {shiftRequests.map((request) => (
            <div
              key={request.id}
              style={{
                background: '#1e1e1e',
                border: '1px solid #444',
                padding: '1rem',
                borderRadius: '8px',
              }}
            >
              <p><strong>ผู้ขอ:</strong> {request.requester}</p>
              <p><strong>วันที่:</strong> {request.date}</p>
              <p><strong>กะ:</strong> {request.shift}</p>
              <p><strong>เหตุผล:</strong> {request.reason}</p>
              <p><strong>สถานะ:</strong> {
                request.status === 'pending' ? 'รอดำเนินการ' :
                request.status === 'accepted' ? '✅ ยอมรับแล้ว' :
                '❌ ปฏิเสธแล้ว'
              }</p>

              {request.status === 'pending' && (
                <div style={{ marginTop: '0.8rem', display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => handleAccept(request.id)}
                    style={{
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    ✅ ยอมรับ
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    style={{
                      backgroundColor: '#f44336',
                      color: '#fff',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    ❌ ปฏิเสธ
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
    
    
  );
};

export default ShiftRequestsPage;
