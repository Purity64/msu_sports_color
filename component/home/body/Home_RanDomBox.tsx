"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import Swal from "sweetalert2";
import Image from "next/image";
import imgrandom1 from "@/public/random/1.png";
import imgrandom2 from "@/public/random/2.png";

import { useRouter } from "next/navigation";

export default function Home_RanDomBox() {
  const router = useRouter();
  const [predeterminedColor , setpredeterminedColor] = useState<string>("");
  const [deg, setDeg] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const colorMap = {
    yellow: { angle: 315, name: "สีเหลือง", flag: "💛" }, 
    green: { angle: 45, name: "สีเขียว", flag: "💚" },  
    blue: { angle: 225, name: "สีน้ำเงิน", flag: "💙" },  
    pink: { angle: 135, name: "สีชมพู", flag: "🩷" },   
  };

  const handleSpin = async () => {
    
    if (isSpinning) return;

    try {
      const res = await fetch("/api/home/random", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ระบบปิดให้บริการ",
            icon: "error",
            confirmButtonColor: '#1e293b',
          });

          return;
      }

      const data = await res.json();
      const chosenColor = data.color; 

      setpredeterminedColor(chosenColor);

      // เริ่มต้นกระบวนการหมุน
      setIsSpinning(true);
      setResult(null);
      setActiveColor(null);

      const target = colorMap[chosenColor as keyof typeof colorMap];
      if (!target) {
        throw new Error("ไม่พบข้อมูลสีในระบบ");
      }

      const startAngle = deg;
      const spins = 1800; 
      const currentBase = Math.floor(startAngle / 360) * 360; 
      const targetAngle = currentBase + spins + target.angle;

      const duration = 3000; 
      const startTime = performance.now();

      const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;

        if (elapsed >= duration) {
          setDeg(targetAngle);
          setActiveColor(chosenColor); // ใช้ chosenColor
          setResult(chosenColor);      // ใช้ chosenColor
          setIsSpinning(false);

          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFCB05', '#10B981', '#3B82F6', '#F472B6']
          });

          Swal.fire({
            title: 'ยินดีด้วย!',
            html: `คุณถูกจัดให้อยู่ <b>${target.name}</b> ${target.flag}`,
            icon: 'success',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#1e293b',
            background: '#ffffff',
            backdrop: `rgba(0,0,0,0.4)`
          }).then((swalResult) => {
            if (swalResult.isConfirmed || swalResult.isDismissed) {
              router.refresh(); 
            }
          });
        } else {
          const progress = elapsed / duration;
          const easedProgress = easeOutQuart(progress);
          const currentAngle = startAngle + (targetAngle - startAngle) * easedProgress;

          setDeg(currentAngle);

          const normalizedAngle = ((currentAngle % 360) + 360) % 360;
          let currentHoverColor = "yellow";

          if (normalizedAngle >= 0 && normalizedAngle < 90) {
            currentHoverColor = "green";
          } else if (normalizedAngle >= 90 && normalizedAngle < 180) {
            currentHoverColor = "pink";
          } else if (normalizedAngle >= 180 && normalizedAngle < 270) {
            currentHoverColor = "blue";
          } else {
            currentHoverColor = "yellow";
          }

          setActiveColor(currentHoverColor);
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);

    } catch (error) {
      console.error(error);
      setIsSpinning(false);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อระบบสุ่มได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: '#1e293b',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-lg mx-auto">
      {/* กระดานสุ่ม (Grid) */}
      <div className="w-full aspect-square grid grid-cols-6 grid-rows-7 gap-4 relative">
        
        {/* กล่องสีเหลือง */}
        <div className={`col-span-2 row-span-2 bg-amber-300 text-amber-900 rounded-2xl flex items-center justify-center font-black text-xl border-4 border-amber-200 transition-all duration-150 ease-out ${
          activeColor === 'yellow' ? 'scale-110 shadow-[0_0_30px_rgba(251,191,36,0.8)] z-10 ring-4 ring-amber-400' : 'shadow-md opacity-70'
        }`}>
          สีเหลือง
        </div>
        
        {/* กล่องสีเขียว */}
        <div className={`col-span-2 row-span-2 col-start-5 bg-emerald-400 text-emerald-950 rounded-2xl flex items-center justify-center font-black text-xl border-4 border-emerald-300 transition-all duration-150 ease-out ${
          activeColor === 'green' ? 'scale-110 shadow-[0_0_30px_rgba(52,211,153,0.8)] z-10 ring-4 ring-emerald-400' : 'shadow-md opacity-70'
        }`}>
          สีเขียว
        </div>
        
        {/* กล่องสีน้ำเงิน */}
        <div className={`col-span-2 row-span-2 col-start-1 row-start-6 bg-blue-500 text-white rounded-2xl flex items-center justify-center font-black text-xl border-4 border-blue-400 transition-all duration-150 ease-out ${
          activeColor === 'blue' ? 'scale-110 shadow-[0_0_30px_rgba(59,130,246,0.8)] z-10 ring-4 ring-blue-400' : 'shadow-md opacity-70'
        }`}>
          สีน้ำเงิน
        </div>
        
        {/* กล่องสีชมพู */}
        <div className={`col-span-2 row-span-2 col-start-5 row-start-6 bg-pink-400 text-white rounded-2xl flex items-center justify-center font-black text-xl border-4 border-pink-300 transition-all duration-150 ease-out ${
          activeColor === 'pink' ? 'scale-110 shadow-[0_0_30px_rgba(244,114,182,0.8)] z-10 ring-4 ring-pink-400' : 'shadow-md opacity-70'
        }`}>
          สีชมพู
        </div>

        {/* จุดศูนย์กลาง (หมวกคัดสรร) */}
        <div className="col-span-2 row-span-3 col-start-3 row-start-3 flex items-center justify-center relative">
          
          {!isSpinning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div className="absolute w-[110px] h-[110px] rounded-full border-4 border-slate-400/40 bg-slate-400/5 animate-ping" />
              <div 
                className="absolute w-[110px] h-[110px] rounded-full border-4 border-slate-400/20 bg-slate-400/5 animate-ping" 
                style={{ animationDelay: "0.6s" }}
              />
            </div>
          )}

          {/* เข็มลูกศรที่จะหมุน */}
          <div 
            className="absolute inset-0 flex items-start justify-center py-2 z-10 pointer-events-none"
            style={{ transform: `rotate(${deg}deg)` }}
          >
            <div className="w-4 h-12 rounded-full shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[16px] border-slate-800" />
            </div>
          </div>

          {/* ปุ่มตรงกลาง */}
          <button 
            onClick={handleSpin}
            disabled={isSpinning}
            className={`relative z-20 w-[110px] h-[110px] rounded-full shadow-xl flex flex-col items-center justify-center p-2 transition-all ${
              isSpinning ? 'cursor-not-allowed scale-100' : 'cursor-pointer hover:bg-slate-50 active:scale-95'
            }`}
          >
            <div className="w-22 h-22 hover:scale-140 relative filter drop-shadow-sm flex items-center justify-center mb-1">
              {isSpinning ? (
                <Image src={imgrandom2} alt="Sorting Hat" className="object-contain" />
              ) : (
                <Image src={imgrandom1} alt="Sorting Hat" className="object-contain" />
              )}
            </div>
            
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              {isSpinning ? "Sorting..." : "กดสุ่ม"}
            </span>
          </button>

        </div>
      </div>
    </div>
  );
}