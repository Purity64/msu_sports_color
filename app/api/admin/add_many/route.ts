import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { pool } from '@/lib/db';
import { isLoginadmin } from '@/lib/Islogin';

export async function POST(req: NextRequest) {
  if (!(await isLoginadmin())) {
    return NextResponse.json({ message: "ไม่ได้รับอนุญาต" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { studentIds } = body; 

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json({ message: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }


    const values = studentIds.map(id => {
      const uniqueToken = crypto.randomUUID(); 
      return [id, uniqueToken];
    });

    const [result]: any = await pool.query(
      "INSERT IGNORE INTO user (student_id , token) VALUES ?",
      [values]
    );

    return NextResponse.json({ 
      message: "นำเข้าข้อมูลสำเร็จ", 
      inserted: result.affectedRows 
    }, { status: 200 });

  } catch (error) {
    console.error("Bulk Insert Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}