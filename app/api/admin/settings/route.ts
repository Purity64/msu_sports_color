import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // 💡 นำเข้า NextRequest
import { pool } from '@/lib/db';
import { isLoginadmin } from '@/lib/Islogin';

export async function POST(req: NextRequest) {
  if (!(await isLoginadmin())) {
    return NextResponse.json({ message: "ไม่ได้รับอนุญาต" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { isOpen } = body; 

    if (isOpen !== 0 && isOpen !== 1) {
      return NextResponse.json({ message: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    await pool.execute(
      "UPDATE settings SET open_random = ? WHERE id = 1", 
      [isOpen]
    );

    return NextResponse.json({ message: "อัปเดตสำเร็จ", isOpen }, { status: 200 });

  } catch (error) {
    console.error("API Settings Update Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}