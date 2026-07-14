// app/not-found.tsx
"use client"; // 💡 1. เปิดใช้งาน Client Component

import { signOut } from "next-auth/react"; // 💡 2. นำเข้าฟังก์ชัน signOut

export default function NotFound() {
  const handleLogOut = async () => {
    // 💡 สั่งออกจากระบบ และสั่งให้ระบบรีไดเรกต์ไปที่หน้า Login ทันที
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] px-4 text-center">
      <div className="relative mb-4">
        {/* เอฟเฟกต์แสงฟุ้งด้านหลังตัวเลข */}
        <div className="absolute inset-0 bg-slate-500/10 blur-3xl rounded-full" />
        <h1 className="text-9xl font-black text-slate-200 tracking-widest relative z-10 animate-pulse">
          404
        </h1>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        ไม่พบหน้าเว็บที่คุณต้องการ
      </h2>
      
      <p className="text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">
        ขออภัย ลิงก์ที่คุณเข้าชมอาจจะไม่ถูกต้อง ถูกลบออกไปแล้ว หรือคุณไม่มีสิทธิ์เข้าถึงหน้านี้
      </p>

      {/* 💡 3. เปลี่ยนจาก <Link> เป็น <button> พร้อมใส่ฟังก์ชัน onClick */}
      <button 
        onClick={handleLogOut}
        className="px-6 py-3 bg-rose-500 text-white font-bold rounded-xl shadow-lg hover:bg-rose-600 active:scale-95 transition-all text-sm uppercase tracking-wide cursor-pointer"
      >
        ออกจากระบบ
      </button>
    </div>
  );
}