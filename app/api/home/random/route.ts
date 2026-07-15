import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { pool } from '@/lib/db'; 
import { isLogin , getStudentID} from '@/lib/Islogin';

export async function POST() {
    if (await isLogin()) {
        const session = await getServerSession(authOptions);

        try {
            const [settings]: any = await pool.query(
                "SELECT open_random FROM settings WHERE id = 1",
            );
            if (settings.length > 0 && settings[0].open_random === 0) {
                return NextResponse.json({ message: "ระบบสุ่มถูกปิดอยู่ในขณะนี้" }, { status: 403 });
            }
        } catch {
            return NextResponse.json({ message: "ระบบเกิดข้อผิดพลาด" }, { status: 500 });
        }

        // ดึงการเชื่อมต่อ (Connection) ออกมาจาก Pool เพื่อทำ Transaction
        const connection = await pool.getConnection();

        try {
            const stdid = await getStudentID(session?.user.email as string);
            const token = session?.user.token as string;

            // 1. เริ่มต้น Transaction
            await connection.beginTransaction();

            // ตรวจสอบผู้ใช้ (เพิ่ม FOR UPDATE เพื่อล็อก row นี้ไว้ไม่ให้ request อื่นมาปนขณะกำลังทำงาน)
            const [selects]: any = await connection.execute(
                "SELECT token, color FROM user WHERE student_id = ? AND token = ? FOR UPDATE",
                [stdid, token]
            );
            
            if (!selects || selects.length === 0) {
                await connection.rollback();
                return NextResponse.json({ message: "ไม่พบผู้ใช้" }, { status: 404 });
            }
            
            const select = selects[0];
            if (select.token !== token) {
                await connection.rollback();
                return NextResponse.json({ message: "ไม่พบผู้ใช้" }, { status: 404 });
            }

            if (select.color) {
                await connection.rollback();
                return NextResponse.json({ message: "คุณได้รับสีไปแล้ว", color: select.color }, { status: 400 });
            }

            const [select_count]: any = await connection.execute(`
                SELECT 
                    SUM(CASE WHEN color = 'yellow' THEN 1 ELSE 0 END) as yellow,
                    SUM(CASE WHEN color = 'green' THEN 1 ELSE 0 END) as green,
                    SUM(CASE WHEN color = 'blue' THEN 1 ELSE 0 END) as blue,
                    SUM(CASE WHEN color = 'pink' THEN 1 ELSE 0 END) as pink
                FROM user FOR UPDATE
            `);

            const arr = {
                yellow: { coun: parseInt(select_count[0]?.yellow ?? 0, 10) },
                green:  { coun: parseInt(select_count[0]?.green ?? 0, 10) },
                blue:   { coun: parseInt(select_count[0]?.blue ?? 0, 10) },
                pink:   { coun: parseInt(select_count[0]?.pink ?? 0, 10) }
            };

            const minCount = Math.min(...Object.values(arr).map(item => item.coun));
            const minColors = Object.keys(arr).filter(
                key => arr[key as keyof typeof arr].coun === minCount
            );
            const minColor = minColors[Math.floor(Math.random() * minColors.length)];

            // 3. ทำการอัปเดตสีลงฐานข้อมูล
            const [updateResult]: any = await connection.execute(
                "UPDATE user SET color = ? WHERE token = ? AND role = 'user'",
                [minColor, token]
            );

            if (updateResult.affectedRows === 0) {
                await connection.rollback();
                return NextResponse.json({ message: "อัปเดตข้อมูลไม่สำเร็จ" }, { status: 400 });
            }

            const [insert_log] : any = await connection.execute("INSERT INTO log(user , random_value , at) VALUES(? , ? , NOW())",[stdid , minColor ])

            await connection.commit();
            
            return NextResponse.json({ message: "สำเร็จ", color: minColor }, { status: 200 });

        } catch (error) {
            await connection.rollback();
            console.error("Transaction Error:", error);
            return NextResponse.json({ message: "ระบบเกิดข้อผิดพลาดกรุณาลองอีกครั้ง" }, { status: 500 });
        } finally {
            connection.release();
        }
        
    } else {
        return NextResponse.json({ message: "กรุณา login ใหม่อีกครั้ง" }, { status: 401 });
    }
}