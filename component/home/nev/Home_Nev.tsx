"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core"; 
import { signOut } from "next-auth/react";

function Home_nev() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const userFirstChar = session?.user?.name?.charAt(0).toUpperCase() || "U";
  const roloe = session?.user.role;
  
  return (
    <nav className="flex items-center justify-between p-4 w-full bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm z-40">
      
      <div className="flex items-center gap-1.5 selection:bg-amber-200">
        <h1 className="text-2xl font-black tracking-tight text-[#1e293b] flex">
          <p>CS</p> <span className="text-[#d9a406] font-bold mx-2">Sports Day</span> {roloe === "admin" && ( <p>Admin Panal</p> ) }
        </h1>
      </div>

      <div className="flex items-center relative gap-4">
        


        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-[50px] h-[50px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 ring-2 ring-transparent transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
            isOpen ? "ring-[#FFCB05] border-transparent" : "hover:ring-slate-200"
          }`}
        >
          {session?.user?.image ? (
            <Image 
              src={session?.user.image} 
              alt="Profile Picture"
              width={50}
              height={50} 
              className="object-cover w-full h-full" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#1e293b] to-[#334155] text-[#FFCB05] font-bold text-base">
              {userFirstChar}
            </div>
          )}
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

            {/* เติม right-0 เพื่อล็อกตำแหน่งหน้าต่างตัวเลือกให้อยู่ขวาสุดอย่างเสถียร */}
            <div className="absolute right-0 top-14 z-20 min-w-[260px] bg-white rounded-2xl p-5 shadow-2xl border border-slate-100/80 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-3 duration-200">
              
              <div className="w-14 h-14 rounded-2xl overflow-hidden mb-3 border border-slate-100 shadow-sm flex items-center justify-center bg-slate-50">
                {session?.user?.image ? (
                  <Image 
                    src={session.user.image} 
                    alt="Profile Picture"
                    width={56}
                    height={56} 
                    className="object-cover w-full h-full" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#1e293b] to-[#334155] text-[#FFCB05] font-bold text-lg">
                    {userFirstChar}
                  </div>
                )}
              </div>

              {/* ข้อมูลผู้ใช้ */}
              <h3 className="font-bold text-slate-800 text-base line-clamp-1 w-full px-2">
                {session?.user?.name || "สมาชิก MSU"}
              </h3>
              <p className="text-xs font-medium text-slate-400 mt-0.5 mb-4 break-all max-w-[210px] bg-slate-50 py-1 px-2.5 rounded-lg border border-slate-100">
                {session?.user?.email || "email@msu.ac.th"}
              </p>
              
              {/* เส้นคั่นบางเบา */}
              <div className="w-full border-t border-slate-100/80 mb-2"></div>

              {/* ปุ่มออกจากระบบสไตล์โมเดิร์น พร้อมแก้ไทป์ด้วย as IconProp (เผื่อมีปัญหาเดียวกันตอนรันบิลด์) */}
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-red-500 hover:text-red-600 bg-red-50/40 hover:bg-red-50 border border-transparent hover:border-red-100 font-bold text-sm transition-all cursor-pointer active:scale-[0.98]"
              >
                <FontAwesomeIcon icon={faSignOutAlt as IconProp} className="text-xs" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </>
        )}
      </div>

    </nav>
  );
}

export default Home_nev;
