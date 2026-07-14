import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { isLoginadmin } from '@/lib/Islogin';

// เพิ่มผู้ใช้ทีละคน หรือเป็นชุด (bulk)
export async function POST(req: Request) {
  if (!(await isLoginadmin())) {
    return NextResponse.json({ message: "ไม่ได้รับอนุญาต" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const studentIds: string[] = Array.isArray(body.studentIds)
      ? body.studentIds
      : [body.studentId];

    // กรองค่าซ้ำ/ว่าง และ format (ตัดช่องว่าง)
    const cleaned = Array.from(
      new Set(
        studentIds
          .map((id) => String(id).trim())
          .filter((id) => id.length > 0)
      )
    );

    if (cleaned.length === 0) {
      return NextResponse.json({ message: "ไม่มีรหัสนิสิต" }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // ดึงรหัสที่มีอยู่แล้ว เพื่อ skip
      const placeholders = cleaned.map(() => "?").join(",");
      const [existing]: any = await connection.execute(
        `SELECT student_id FROM user WHERE student_id IN (${placeholders})`,
        cleaned
      );
      const existingSet = new Set(existing.map((r: any) => r.student_id));

      const toInsert = cleaned.filter((id) => !existingSet.has(id));

      if (toInsert.length > 0) {
        const values = toInsert.map(() => "(?, NULL, 'user', NULL)").join(",");
        const params = toInsert.flatMap((id) => [id]);
        await connection.execute(
          `INSERT INTO user (student_id, token, role, color) VALUES ${values}`,
          params
        );
      }

      await connection.commit();

      return NextResponse.json({
        message: "สำเร็จ",
        added: toInsert.length,
        skipped: cleaned.length - toInsert.length,
      }, { status: 200 });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "เพิ่มผู้ใช้ไม่สำเร็จ" }, { status: 500 });
  }
}

// ดึงรายชื่อผู้ใช้ทั้งหมด
export async function GET() {
  if (!(await isLoginadmin())) {
    return NextResponse.json({ message: "ไม่ได้รับอนุญาต" }, { status: 401 });
  }

  try {
    const [rows]: any = await pool.execute(
      "SELECT student_id, color FROM user WHERE role = 'user' ORDER BY student_id"
    );

    return NextResponse.json({ users: rows }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "ดึงข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}