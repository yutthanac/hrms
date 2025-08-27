// src/routes/users.ts
import { Router } from "express";
import pool from "../config/db";
import { RowDataPacket } from "mysql2";

const router = Router();

/** ------------------------------------------------------------------
 *  GET /api/users
 *  (สำหรับ debug ได้ แต่ไม่ส่ง password ออกไป)
 * ------------------------------------------------------------------ */
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, username, role_id FROM users ORDER BY id`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "DB error" });
  }
});

/** ------------------------------------------------------------------
 *  ฟังก์ชั่นรวมคิวรีข้อมูลผู้ใช้ (ใช้ซ้ำทั้ง /:id และ /by-username)
 *  ปรับคอลัมน์/ตารางตามสคีมาที่คุณมีจริง
 * ------------------------------------------------------------------ */
const USER_SELECT = `
  SELECT 
    u.id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    u.role_id,
    u.department_id,
    p.prefix_name,
    CONCAT(COALESCE(p.prefix_name, ''), u.first_name, ' ', u.last_name) AS full_name,
    r.role_name,
    d.department_name
  FROM users u
  LEFT JOIN prefixes p     ON p.id = u.prefix_id
  LEFT JOIN roles r        ON r.id = u.role_id
  LEFT JOIN departments d  ON d.id = u.department_id
`;

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid id" });

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `${USER_SELECT} WHERE u.id = ? LIMIT 1`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user by id:", err);
    res.status(500).json({ error: "DB error" });
  }
});

/** ------------------------------------------------------------------
 *  (ออปชัน) GET /api/users/by-username/:username
 *  เผื่อกรณีต้องดึงจาก username หลังล็อกอิน
 * ------------------------------------------------------------------ */
router.get("/by-username/:username", async (req, res) => {
  const { username } = req.params;
  if (!username) return res.status(400).json({ error: "Invalid username" });

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `${USER_SELECT} WHERE u.username = ? LIMIT 1`,
      [username]
    );
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user by username:", err);
    res.status(500).json({ error: "DB error" });
  }
});

/** ------------------------------------------------------------------
 *  (ออปชัน) GET /api/users/me
 *  ถ้าคุณใช้ JWT: ดึง userId จาก req.user.id ที่ middleware ใส่ไว้
 * ------------------------------------------------------------------ */
// router.get("/me", async (req: any, res) => {
//   const userId = Number(req.user?.id);
//   if (!userId) return res.status(401).json({ error: "Unauthenticated" });
//   try {
//     const [rows] = await pool.query<RowDataPacket[]>(
//       `${USER_SELECT} WHERE u.id = ? LIMIT 1`,
//       [userId]
//     );
//     if (!rows.length) return res.status(404).json({ error: "User not found" });
//     res.json(rows[0]);
//   } catch (err) {
//     console.error("Error fetching /me:", err);
//     res.status(500).json({ error: "DB error" });
//   }
// });

export default router;
