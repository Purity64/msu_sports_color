"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function GoogleIcon() {
  return (
    <svg className="mr-3 h-5 w-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home"); 
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="w-full min-h-screen flex items-center justify-center ">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#d9a406]"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full flex min-h-screen items-center justify-center font-sans ">
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="rounded-2xl bg-white/98 p-8 shadow-2xl ring-1 ring-black/[0.08] border border-slate-100">
          
          <header className="w-full flex flex-col items-center justify-center mb-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFCB05] text-[#1e293b] font-black text-2xl shadow-inner border border-amber-400">
              MSU
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-[#1e293b]">
              CS <span className="text-[#d9a406] drop-shadow-sm font-bold">Sports</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1.5">ระบบจัดการกีฬาวิทยาการคอมพิวเตอร์</p>
          </header>

          <button
            // ใส่ callbackUrl เพื่อระบุว่าหลังผ่านขั้นตอนล็อกอินของ Google แล้ว ให้เด้งกลับไปที่หน้าใด
            onClick={() => signIn("google", { callbackUrl: "/home" })}
            className="w-full flex items-center justify-center bg-white hover:bg-slate-50 text-slate-800 font-bold py-3.5 px-4 border border-slate-300/70 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.99] cursor-pointer"
          >
            <GoogleIcon />
            <span>เข้าสู่ระบบด้วย Google</span>
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 bg-slate-50 py-2.5 px-4 rounded-xl border border-slate-100">
            <span className="h-2 w-2 rounded-full bg-[#d9a406] shrink-0"></span>
            <p className="text-center text-xs font-semibold text-slate-600">
              อนุญาตเฉพาะอีเมล <span className="text-[#1e293b] font-bold underline decoration-[#FFCB05] decoration-2">@msu.ac.th</span> เท่านั้น
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}