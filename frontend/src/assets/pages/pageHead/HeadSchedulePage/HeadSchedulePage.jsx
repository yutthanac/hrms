import { useState, useEffect } from 'react';
import {
  Calendar,
  momentLocalizer,
} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import HeadSidebar from '../../../Component/Head/HeadSidebar';
import ShiftDialog from './ShiftDialog';
import {
  getEmployees,
  getShifts,
  upsertShift,
  broadcastScheduleNotice,
  deleteShiftByDate,
  clearAllShifts,
} from '../../../api/scheduleApi';
import './HeadSchedulePage.css';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

let draggedEmp = null;

export default function HeadSchedulePage() {
  const [events, setEvents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [dialogData, setDialogData] = useState(null);
  const [lastUpdatedDate, setLastUpdatedDate] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    getEmployees().then(setEmployees);
    refreshEvents();
  }, []);

  const refreshEvents = () => {
    getShifts().then((res) => {
      const mapped = res.map((s) => ({
        id: s.id,
        title: `👤 ${s.empName} | กะ: ${s.shift}`,
        start: new Date(`${s.date}T08:00`),
        end: new Date(`${s.date}T16:00`),
        empId: s.empId,
        empName: s.empName,
        shift: s.shift,
        date: s.date,
      }));
      setEvents(mapped);
    });
  };

  const handleSave = async (newShift) => {
    await upsertShift(newShift);
    setLastUpdatedDate(newShift.date);
    setDirty(true);
    refreshEvents();
    setDialogData(null);
  };

  const handleBroadcast = async () => {
    if (!lastUpdatedDate) return;
    await broadcastScheduleNotice(lastUpdatedDate);
    setDirty(false);
    alert('ส่งแจ้งเตือนเรียบร้อย ✅');
  };

  const handleClearAll = async () => {
    if (window.confirm('คุณต้องการลบเวรทั้งหมดหรือไม่?')) {
      await clearAllShifts();
      refreshEvents();
      alert('เคลียร์ตารางทั้งหมดเรียบร้อยแล้ว');
    }
  };

  const handleClearDay = async () => {
    if (!lastUpdatedDate) {
      alert('ยังไม่มีวันที่เลือกสำหรับลบเวรรายวัน');
      return;
    }
    if (window.confirm(`คุณต้องการลบเวรวันที่ ${lastUpdatedDate} หรือไม่?`)) {
      await deleteShiftByDate(lastUpdatedDate);
      refreshEvents();
      alert(`ลบเวรวันที่ ${lastUpdatedDate} เรียบร้อยแล้ว`);
    }
  };

  const onEventDrop = async ({ event, start }) => {
    const updatedShift = {
      id: event.id,
      empId: event.empId,
      empName: event.empName,
      date: moment(start).format('YYYY-MM-DD'),
      shift: event.shift,
    };
    await upsertShift(updatedShift);
    setLastUpdatedDate(updatedShift.date);
    setDirty(true);
    refreshEvents();
  };

  const onEventResize = async ({ event, start, end }) => {
    const updatedShift = {
      id: event.id,
      empId: event.empId,
      empName: event.empName,
      date: moment(start).format('YYYY-MM-DD'),
      shift: event.shift,
    };
    await upsertShift(updatedShift);
    setLastUpdatedDate(updatedShift.date);
    setDirty(true);
    refreshEvents();
  };

  return (
    <div className="layout-container">
      <HeadSidebar />
      <main className="main-content">
        <h1 className="page-title">จัดตารางการทำงาน</h1>

        <div className="button-group">
          <button
            className="btn-notify"
            disabled={!dirty}
            onClick={handleBroadcast}
            style={{ background: dirty ? '#4fc3f7' : '#777' }}
          >
            📤 อัปเดต & แจ้งเตือน
          </button>

          <button className="btn-day-clear" onClick={handleClearDay}>
            🗑️ เคลียร์เวรรายวัน
          </button>

          <button className="btn-clear-all" onClick={handleClearAll}>
            🗑️ เคลียร์เวรทั้งหมด
          </button>
        </div>

        <div className="schedule-container">
          <div className="employee-sidebar">
            <h3>รายชื่อพนักงาน</h3>
            <p style={{ fontSize: 12, color: '#555' }}>
              ลากชื่อพนักงานไปยังวันที่ต้องการในตารางด้านขวา
            </p>
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="emp-card"
                draggable
                onDragStart={() => (draggedEmp = emp)}
              >
                {emp.name}
              </div>
            ))}
          </div>

          <div className="calendar-container">
            <DragAndDropCalendar
              localizer={localizer}
              events={events}
              selectable
              defaultView="month"
              views={['month', 'week', 'day']}
              step={60}
              showMultiDayTimes={false}
              style={{ height: '100%' }}
              onDropFromOutside={({ start }) => {
                if (!draggedEmp) return;
                const dateStr = moment(start).format('YYYY-MM-DD');

                // ลบการเช็ค existingEvent ออก
                setDialogData({
                  empId: draggedEmp.id,
                  empName: draggedEmp.name,
                  date: dateStr,
                  shift: 'A',
                });

                setLastUpdatedDate(dateStr);
                draggedEmp = null;
              }}
              dragFromOutsideItem={() => (draggedEmp ? { ...draggedEmp } : null)}
              onSelectEvent={(ev) =>
                setDialogData({
                  id: ev.id,
                  empId: ev.empId,
                  empName: ev.empName,
                  date: ev.date,
                  shift: ev.shift,
                })
              }
              tooltipAccessor={(event) =>
                `ชื่อ: ${event.empName}\nกะ: ${event.shift}\nวันที่: ${event.date}`
              }
              eventPropGetter={(event) => {
                let backgroundColor = '#fff';
                if (event.shift === 'A') backgroundColor = '#a5d6a7'; // เขียวอ่อน
                else if (event.shift === 'B') backgroundColor = '#ffcc80'; // ส้มอ่อน
                else if (event.shift === 'C') backgroundColor = '#90caf9'; // ฟ้าอ่อน

                return {
                  style: {
                    backgroundColor,
                    color: '#000',
                    border: '1px solid #888',
                    borderRadius: '6px',
                    padding: '4px',
                    fontWeight: 'bold',
                  },
                };
              }}
              onEventDrop={onEventDrop}
              onEventResize={onEventResize}
              resizable
            />
          </div>
        </div>

        {dialogData && (
          <ShiftDialog
            data={dialogData}
            employees={employees}
            onClose={() => setDialogData(null)}
            onSave={handleSave}
          />
        )}
      </main>
    </div>
  );
}
