import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; 
import { pool } from '@/lib/db';
import { isLoginadmin } from '@/lib/Islogin';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  if (!(await isLoginadmin())) {
    return NextResponse.json({ message: "ไม่ได้รับอนุญาต" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id } = body; 

    if (!id) {
        return NextResponse.json({ message: "กรุณาเพิ่มรหัสนักศึกษา" }, { status: 400 });
    }

    const token = crypto.randomUUID();
    await pool.execute(
      "INSERT INTO user(student_id  , token ) VALUES(? , ?)", [id ,token ]
      
    );

    return NextResponse.json({ message: "เพิ่มข้อมูลสำเร็จ" }, { status: 200 });

  } catch (error) {
    console.error("API Settings Update Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}