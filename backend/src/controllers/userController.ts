// src/controllers/users.controller.ts
import { Request, Response } from "express";
import pool from "../config/db";

// GET /api/users?search=&role=&department=&page=1&pageSize=20
export const listUsers = async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      role = "",
      department = "",
      page = "1",
      pageSize = "20",
    } = req.query as Record<string, string>;

    // ✅ กัน NaN และค่าผิดปกติ
    const _pageSize = Number.isFinite(parseInt(pageSize)) ? Math.max(1, parseInt(pageSize)) : 20;
    const _page = Number.isFinite(parseInt(page)) ? Math.max(1, parseInt(page)) : 1;

    const limit = _pageSize;
    const offset = (_page - 1) * limit;

    const filters: string[] = [];
    const params: any[] = [];

    if (search) {
      const like = `%${search}%`;
      filters.push(`(u.username LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`);
      params.push(like, like, like, like, like);
    }
    if (role) {
      filters.push(`r.role_name = ?`);
      params.push(role);
    }
    if (department) {
      filters.push(`d.department_name = ?`);
      params.push(department);
    }

    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    // ✅ ดึงรายการ (LIMIT/OFFSET ต้องเป็น literal number, ไม่ใช้ ?)
    const [rows] = await pool.query(
      `
      SELECT 
        u.id, u.username, u.first_name, u.last_name, u.email, u.phone,
        r.role_name, d.department_name, p.prefix_name
      FROM users u
      LEFT JOIN roles r        ON u.role_id = r.id
      LEFT JOIN departments d  ON u.department_id = d.id
      LEFT JOIN prefixes p     ON u.prefix_id = p.id
      ${where}
      ORDER BY u.id DESC
      LIMIT ${limit} OFFSET ${offset}
      `,
      params
    );

    // ✅ ดึงจำนวนรวม (ใช้พารามฯเดียวกับ where)
    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) as total
      FROM users u
      LEFT JOIN roles r        ON u.role_id = r.id
      LEFT JOIN departments d  ON u.department_id = d.id
      ${where}
      `,
      params
    );

    const total = (countRows as any[])[0]?.total ?? 0;

    res.json({
      data: rows,
      pagination: {
        page: _page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/:id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [userRows] = await pool.query(
      `
      SELECT 
        u.*, r.role_name, d.department_name, p.prefix_name,
        ud.address, ud.birth_date, ud.start_date, ud.note
      FROM users u
      LEFT JOIN roles r        ON u.role_id = r.id
      LEFT JOIN departments d  ON u.department_id = d.id
      LEFT JOIN prefixes p     ON u.prefix_id = p.id
      LEFT JOIN user_detail ud ON ud.user_id = u.id
      WHERE u.id = ?
      `,
      [id]
    );

    const user = (userRows as any[])[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ ถ้าเป็น Employee ให้เห็นเฉพาะของตัวเอง (ต้องมี req.user จาก middleware)
    // ถ้าโปรเจ็กต์คุณยังไม่ได้ declare type ให้ req.user ไว้ global ให้ทำใน middleware ตามที่เคยให้ไว้
    const reqUser: any = (req as any).user;
    if (reqUser?.role === "Employee" && Number(reqUser?.id) !== Number(id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
