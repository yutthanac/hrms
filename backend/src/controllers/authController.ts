import { Request, Response } from "express";
import pool from "../config/db";   // ✅ default import
import { DbUser } from "../types";

/** POST /api/auth/login  body: {username, password} */
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    return res.status(400).json({ ok: false, message: "username/password is required" });
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT id, prefix_id, username, password, first_name, last_name, email, phone, role_id, department_id
      FROM users
      WHERE username = ? AND password = ?
      LIMIT 1
      `,
      [username, password]
    );

    const list = rows as DbUser[];
    if (list.length === 0) {
      return res.status(401).json({ ok: false, message: "Invalid credentials" });
    }

    // ตัด password ออกไม่ส่งกลับ
    const { password: _pw, ...user } = list[0];
    return res.json({ ok: true, user });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
