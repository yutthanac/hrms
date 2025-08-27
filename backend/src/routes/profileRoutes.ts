// src/routes/profileRoutes.ts
import { Router } from "express";
import pool from "../config/db";
import { RowDataPacket } from "mysql2";

const router = Router();

// ดึงข้อมูลพื้นฐานของ user + role/department
const USER_BASE = `
  SELECT 
    u.id, u.username, u.email, u.phone,
    u.first_name, u.last_name, u.role_id, u.department_id,
    p.prefix_name,
    CONCAT(COALESCE(p.prefix_name, ''), u.first_name, ' ', u.last_name) AS full_name,
    r.role_name, d.department_name
  FROM users u
  LEFT JOIN prefixes p    ON p.id = u.prefix_id
  LEFT JOIN roles r       ON r.id = u.role_id
  LEFT JOIN departments d ON d.id = u.department_id
`;

// GET /api/users/:id/profile
router.get("/:id/profile", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid id" });

  try {
    const [urows] = await pool.query<RowDataPacket[]>(
      `${USER_BASE} WHERE u.id = ? LIMIT 1`, [id]
    );
    if (!urows.length) return res.status(404).json({ error: "User not found" });
    const u = urows[0];

    const [drows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM user_detail WHERE user_id = ? LIMIT 1`, [id]
    );
    const d = drows.length ? drows[0] : null;

    const payload = {
      id: u.id,
      full_name: u.full_name,
      role_name: u.role_name,
      department_name: u.department_name,
      email: u.email,
      phone: u.phone,
      profile_pic: d?.profile_pic || null,

      workingStatus: d?.working_status || "-",
      startDate: d?.start_date || null,
      position: d?.position || u.role_name || "-",
      departmentHead: d?.department_head || "-",

      nameTH: d?.name_th || `${u.first_name} ${u.last_name}`,
      nameEN: d?.name_en || null,
      birthday: d?.birthday || null,
      gender: d?.gender || null,
      bloodType: d?.blood_type || null,
      nationality: d?.nationality || null,
      religion: d?.religion || null,
      ethnicity: d?.ethnicity || null,
      height: d?.height_cm || null,
      weight: d?.weight_kg || null,
      siblings: d?.siblings || null,
      disability: d?.disability || "ไม่มี",
      specialAbility: d?.special_ability || null,

      homeAddress: {
        houseNo: d?.home_house_no || "",
        village: d?.home_village || "",
        alley: d?.home_alley || "",
        road: d?.home_road || "",
        province: d?.home_province || "",
        district: d?.home_district || "",
        subdistrict: d?.home_subdistrict || "",
        postalCode: d?.home_postal_code || ""
      },

      contactAddress: {
        houseNo: d?.contact_house_no || "",
        village: d?.contact_village || "",
        alley: d?.contact_alley || "",
        road: d?.contact_road || "",
        province: d?.contact_province || "",
        district: d?.contact_district || "",
        subdistrict: d?.contact_subdistrict || "",
        postalCode: d?.contact_postal_code || "",
        phone: d?.contact_phone || u.phone || "",
        email: d?.contact_email || u.email || ""
      },

      education: {
        degree: d?.edu_degree || "",
        major: d?.edu_major || "",
        year: d?.edu_year || "",
        gpa: d?.edu_gpa || ""
      },

      parentGuardian: {
        father: d?.parent_father || "",
        mother: d?.parent_mother || "",
        guardian: d?.parent_guardian || ""
      },

      otherInfo: d?.other_info || ""
    };

    res.json(payload);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "DB error" });
  }
});

// PUT /api/users/:id/profile/phone  (อัปเดตเฉพาะเบอร์ติดต่อ)
router.put("/:id/profile/phone", async (req, res) => {
  const id = Number(req.params.id);
  const { phone } = req.body || {};
  if (!id) return res.status(400).json({ error: "Invalid id" });
  if (!phone) return res.status(400).json({ error: "phone is required" });

  try {
    await pool.query(
      `INSERT INTO user_detail (user_id, contact_phone)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE contact_phone = VALUES(contact_phone)`,
      [id, phone]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Update phone failed:", err);
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
