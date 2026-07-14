import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; 
import { pool } from '@/lib/db';
import { isLoginadmin } from '@/lib/Islogin';

export async function DELETE(req: NextRequest) {
  if (!(await isLoginadmin())) {
    return NextResponse.json({ message: "ไม่ได้รับอนุญาต" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { token } = body; 

    if (!token) {
        return NextResponse.json({ message: "ไม่พบข้อมูล" }, { status: 400 });
    }

    await pool.execute(
      "DELETE FROM user WHERE token = ?", [token ]
      
    );

    return NextResponse.json({ message: "ลบข้อมูลสำเร็จ" }, { status: 200 });

  } catch (error) {
    console.error("API Settings Update Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}