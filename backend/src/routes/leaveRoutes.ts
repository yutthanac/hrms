import { Router } from "express";
import pool from "../config/db";
import { ResultSetHeader } from "mysql2";

const router = Router();

router.post("/leave-requests", async (req, res) => {
  try {
    const { user_id, leave_type, start_date, end_date, reason } = req.body;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, reason, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [user_id, leave_type, start_date, end_date, reason]
    );

    res.json({ success: true, message: "บันทึกการลาสำเร็จ", insertId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาด" });
  }
});
// GET: ดึงประวัติการลาตาม user_id
router.get("/leave-requests/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.query(
      `SELECT id, leave_type, start_date, end_date, status, reason, created_at
       FROM leave_requests
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

export default router;
