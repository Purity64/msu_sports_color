import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; 
import { pool } from '@/lib/db';
import { isLoginadmin } from '@/lib/Islogin';

export async function POST(req: NextRequest) {
  // 1. ตรวจสอบสิทธิ์การเป็น Admin
  if (!(await isLoginadmin())) {
    return NextResponse.json({ message: "ไม่ได้รับอนุญาต" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { token } = body;

    if (!token) {
      console.log("notiken");
      
      return NextResponse.json({ message: "ไม่พบข้อมูล Token ที่ต้องการลบ" }, { status: 400 });
    }

    // 3. ทำการเคลียร์ค่า color (Type-cast ผลลัพธ์ของ mysql2 เพื่อเอามาเช็คข้อมูล)
    const [result]: any = await pool.execute(
      "UPDATE user SET color = null WHERE token = ?", 
      [token]
    );

    // 4. ตรวจสอบว่ามีแถวที่ถูกแก้ไขจริงไหม (ถ้าไม่มี แปลว่าไม่เจอ token นี้ในระบบ)
    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "ไม่พบข้อมูลผู้ใช้งานที่ระบุ" }, { status: 404 });
    }

    return NextResponse.json({ message: "ลบข้อมูลสำเร็จ" }, { status: 200 });

  } catch (error) {
    console.error("API Settings Delete Error:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}