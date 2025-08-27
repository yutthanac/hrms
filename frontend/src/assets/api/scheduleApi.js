/* ------------------------------------------------------------------
 *  scheduleApi.js  –  Mock API (In‑memory)  สำหรับตารางเวร
 *  ตำแหน่งไฟล์  ➜  src / assets / api / scheduleApi.js
 * ------------------------------------------------------------------*/

/* ========= Mock Data ========= */
let employees = [
  { id: 'EMP-001', name: 'ยุทธนา ชัยไธสง',    position: 'พนักงาน' },
  { id: 'EMP-002', name: 'ฐานุพงศ์ พิชิตวงศ์ศรี', position: 'พนักงาน' },
  { id: 'EMP-003', name: 'ธีรเทพ ใจกล้า', position: 'พนักงาน' },
];

let shifts = [
  { id: '2025-07-16_A_EMP-001', date: '2025-07-16', shift: 'A', empId: 'EMP-001', empName: 'สมชาย ใจดี' },
];

/* ========= Utility ========= */
const pause = (ms) => new Promise((res) => setTimeout(res, ms));

/* ========= NAMED EXPORTS (ต้องมี) ========= */

/** ดึงรายชื่อพนักงานทั้งหมด */
export async function getEmployees() {
  await pause(150);
  return [...employees];
}

/** ดึงตารางเวรทั้งหมด */
export async function getShifts() {
  await pause(150);
  return [...shifts];
}

/** เพิ่มหรือแก้เวร */
export async function upsertShift(newShift) {
  await pause(120);
  // ใช้ id เป็นวันที่+กะ+รหัสพนักงาน เพื่อไม่ให้ซ้ำ
  if (!newShift.id) {
    newShift.id = `${newShift.date}_${newShift.shift}_${newShift.empId}`;
  }
  const idx = shifts.findIndex(s => s.id === newShift.id);
  if (idx > -1) shifts[idx] = newShift;  // update
  else          shifts.push(newShift);   // insert
}

/** ลบเวรด้วย id */
export async function deleteShift(id) {
  await pause(120);
  shifts = shifts.filter(s => s.id !== id);
}

/** เคลียร์เวรทั้งหมด */
export async function clearAllShifts() {
  await pause(120);
  shifts = [];
  console.log('🔔 [Mock] เคลียร์เวรทั้งหมดเรียบร้อย');
}

/** เคลียร์เวรตามวันที่ */
export async function deleteShiftByDate(date) {
  await pause(120);
  shifts = shifts.filter(s => s.date !== date);
  console.log(`🔔 [Mock] เคลียร์เวรวันที่ ${date} เรียบร้อย`);
}

/** แจ้งเตือนตารางเวร */
export async function broadcastScheduleNotice(date) {
  await pause(200);
  console.log(`🔔 [Mock] แจ้งเตือนตารางเวรใหม่ของวันที่ ${date} ไปยังพนักงานทุกคนแล้ว`);
}
