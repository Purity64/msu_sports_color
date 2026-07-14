"use client";

import { useState } from "react";

interface UserItem {
  student_id: string;
  name: string;
}

interface HomeDetailProps {
  color: string;
  uselist: UserItem[];
}

function Home_detail({ color, uselist = [] }: HomeDetailProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = uselist.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.student_id.toLowerCase().includes(searchLower) ||
      item.name.toLowerCase().includes(searchLower)
    );
  });

  const colorEmojiMap: Record<string, string> = {
    yellow: "💛 ทีมสีเหลือง",
    green: "💚 ทีมสีเขียว",
    blue: "💙 ทีมสีน้ำเงิน",
    pink: "🩷 ทีมสีชมพู",
  };

  return (
    <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col transition-all">
      {/* Header */}
      <header className="flex items-center justify-between w-full border-b border-slate-100 pb-4">
        <h1 className="text-xl font-bold text-slate-800">รายชื่อสมาชิกทีม</h1>
        <span className="text-sm font-semibold px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-slate-700">
          {colorEmojiMap[color] || color}
        </span>
      </header>

      {/* กล่องค้นหา (UX/UI Search Bar) */}
      <div className="mt-5 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="ค้นหาด้วยรหัสนิสิต หรือชื่อ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:bg-white transition-all text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ล้าง
            </button>
          )}
        </div>
      </div>

      {/* ส่วนแสดงรายชื่อ (User List Items) */}
      <div className="mt-6 flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((item, i) => (
            <div
              key={item.student_id || i}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/80 hover:bg-slate-100/50 hover:border-slate-200 transition-all group"
            >
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-medium text-slate-400 group-hover:text-slate-500 transition-colors">
                  รหัสนิสิต
                </p>
                <p className="font-mono text-sm font-semibold text-slate-700">
                  {item.student_id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">
                  {item.name}
                </p>
              </div>
            </div>
          ))
        ) : (
          // UX Empty State เมื่อค้นหาแล้วไม่เจอใครเลย
          <div className="text-center py-10 text-slate-400 flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">🔍</span>
            <p className="text-sm font-medium">ไม่พบข้อมูลรายชื่อสมาชิก</p>
            {searchTerm && <p className="text-xs text-slate-400 mt-1">ลองใช้คำค้นหาอื่นแทน</p>}
          </div>
        )}
      </div>
      
      {/* สรุปยอดรวมจำนวนสมาชิกทีม */}
      <footer className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-medium">
        <span>แสดงทั้งหมด {filteredUsers.length} คน</span>
      </footer>
    </div>
  );
}

export default Home_detail;