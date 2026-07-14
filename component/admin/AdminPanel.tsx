"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GetOpen , GetUsersByColor } from "@/util/GetSetting"
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function AdminPanel() {
  const [studentId, setStudentId] = useState("");
  const [previewIds, setPreviewIds] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const arr_color = ["yellow", "green", "blue", "pink" , "null"];
  const [actionh_color , setactionh_color] = useState<string>("yellow");

  const [user , setuser] = useState<any>([]);

  const colorVariants: Record<string, { bg: string; hover: string; text: string; label: string }> = {
    yellow: { bg: "bg-amber-500", hover: "hover:bg-amber-600", text: "text-amber-900", label: "สีเหลือง" },
    green: { bg: "bg-emerald-500", hover: "hover:bg-emerald-600", text: "text-emerald-900", label: "สีเขียว" },
    blue: { bg: "bg-blue-500", hover: "hover:bg-blue-600", text: "text-blue-950", label: "สีน้ำเงิน" },
    pink: { bg: "bg-rose-400", hover: "hover:bg-rose-500", text: "text-rose-950", label: "สีชมพู" },
    null: { bg: "bg-gray-400", hover: "hover:bg-gray-500", text: "text-gray-950", label: "ยังไม่ได้จับสี" },
  };

  const [isOpen , setisOpen] = useState<boolean>(false);
  
  const fetchOpen = async() => {
    const data = await GetOpen();
    setisOpen(data === 1);
  }
  
  useEffect(() => {
    fetchOpen();
    fetch_user();
  },[])

  const handelOpen = async(open:boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: open ? 1 : 0 })
      });

      if (!res.ok) throw new Error("ปรับปรุงสเตตัสไม่สำเร็จ");
      fetchOpen();
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถเปิด/ปิดระบบสุ่มได้ในขณะนี้',
      });
    } finally {
      setLoading(false);
    }
  }

  const fetch_user = async (colorToFetch = actionh_color) => {
    const data = await GetUsersByColor(colorToFetch);
    setuser(data);
  };

  const handel_getuser = (color: string) => {
    setactionh_color(color);
    fetch_user(color);
  };



  

  const handelinput_student = async() => {
    if (!studentId.trim()) {
      return Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบ',
        text: 'กรุณากรอกรหัสนิสิต',
      });
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/add_one", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id : studentId.trim() })
      });

      if (!res.ok) throw new Error("เพิ่มไม่สำเร็จ");
      
      Swal.fire({
        icon: 'success',
        title: 'เพิ่มข้อมูลนิสิตสำเร็จ',
      });
      setStudentId("");
      fetch_user();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'รหัสนิสิตอาจจะซ้ำกันในระบบ',
      });
    } finally {
      setLoading(false);
    }
  }

const handel_delete = async (token: string) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบข้อมูล?',
      text: "คุณต้องการลบรายชื่อนิสิตคนนี้ใช่หรือไม่? เมื่อลบแล้วจะไม่สามารถกู้คืนได้",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#1e293b',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
      buttonsStyling: true
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/delete_user", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token }) 
        });

        if (!res.ok) throw new Error("ลบไม่สำเร็จ");

        await Swal.fire({
          icon: 'success',
          title: 'ลบข้อมูลสำเร็จ',
          text: 'ระบบได้ลบข้อมูลนิสิตเรียบร้อยแล้ว',
          timer: 1500,
          showConfirmButton: false
        });

        fetch_user();

      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถลบข้อมูลได้ในขณะนี้',
        });
      } finally {
        setLoading(false);
      }
    }
  };


  const handelUploadAll = async () => {
    if (previewIds.length === 0) return;

    // 💡 1. แสดง UI คอนเฟิร์มก่อนเริ่มอัปโหลดชุดใหญ่
    const result = await Swal.fire({
      title: 'ยืนยันการนำเข้าข้อมูล?',
      text: `คุณกำลังจะเพิ่มรายชื่อนิสิตจำนวน ${previewIds.length} คน เข้าสู่ระบบ`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1e293b',
      cancelButtonColor: '#slate-300',
      confirmButtonText: 'ตกลง, นำเข้าข้อมูล',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      setLoading(true);
      
      // แสดง Loading สวยๆ ระหว่างที่ฐานข้อมูลกำลังทำงาน
      Swal.fire({
        title: 'กำลังบันทึกข้อมูล...',
        text: 'กรุณารอสักครู่ ระบบกำลังนำเข้ารายชื่อนิสิต',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        // 💡 2. ยิง API ส่งอาเรย์รหัสนิสิตทั้งหมดไปหลังบ้าน
        const res = await fetch("/api/admin/add_many", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentIds: previewIds })
        });

        if (!res.ok) throw new Error("นำเข้าข้อมูลล้มเหลว");

        const data = await res.json();

        // 💡 3. แจ้งเตือนเมื่อเสร็จสิ้น
        await Swal.fire({
          icon: 'success',
          title: 'นำเข้าข้อมูลสำเร็จ!',
          text: `ระบบได้เพิ่มนิสิตใหม่จำนวน ${data.inserted || previewIds.length} คนเรียบร้อยแล้ว`,
        });

        // 💡 4. ล้างค่าไฟล์เดิมออก และอัปเดตตารางรายชื่อใหม่
        clearFile();
        fetch_user(); 

      } catch (error) {
        console.error("Bulk upload error:", error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถนำเข้าข้อมูลได้ อาจมีข้อมูลบางส่วนซ้ำในระบบ',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // แปลงเป็น Array ข้อมูล (ดึงคอลัมน์แรกสุดมาเป็นรหัสนิสิต)
        const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const ids = data
          .map(row => String(row[0]).trim())
          .filter(id => id && id !== "undefined" && id.length > 5); // กรองค่าว่างออก

        setPreviewIds(ids);
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'อ่านไฟล์ล้มเหลว', text: 'รูปแบบไฟล์ไม่ถูกต้อง' });
      }
    };
    reader.readAsBinaryString(file);
  };

  const clearFile = () => {
    setPreviewIds([]);
    setFileName(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDownloadExcel = () => {
    if (user.length === 0) {
      return Swal.fire({
        icon: 'warning',
        title: 'ไม่มีข้อมูล',
        text: 'ไม่มีข้อมูลนิสิตในกลุ่มสีนี้ที่จะดาวน์โหลด',
      });
    }

    // 💡 1. จัดการ Mapping โครงสร้างข้อมูลสำหรับไฟล์ Excel
    const dataToExport = user.map((u: any) => ({
      "รหัสนิสิต": u.student_id,
      "ชื่อ-นามสกุล": u.name || "ยังไม่ได้ตั้งชื่อ",
      "กลุ่มสีที่ได้": colorVariants[u.color]?.label || u.color || "ยังไม่ได้สุ่ม"
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `รายชื่อนิสิต`);

    const currentColorLabel = colorVariants[actionh_color]?.label || actionh_color;
    const exportFileName = `รายชื่อนิสิต_${currentColorLabel}.csv`;

    // 💡 4. สั่งดาวน์โหลดลงเครื่องทันที
    XLSX.writeFile(workbook, exportFileName);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-1">ตั้งค่าระบบสุ่ม</h2>
        <p className="text-sm text-slate-400 mb-5">เปิด/ปิดการใช้งานระบบสุ่มสีของนิสิต</p>

        <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div>
            <p className="font-semibold text-slate-700">สถานะระบบสุ่ม</p>
            <p className={`text-sm font-medium ${isOpen ? "text-green-600" : "text-red-500"}`}>
              {isOpen ? "เปิดอยู่" : "ปิดอยู่"}
            </p>
          </div>
          <button
            onClick={() => handelOpen(!isOpen)}
            disabled={loading}
            className={`relative inline-flex h-8 w-16 items-center cursor-pointer rounded-full transition-colors disabled:opacity-50 ${
              isOpen ? "bg-green-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                isOpen ? "translate-x-9" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </section>

      {/* ===== เพิ่มผู้ใช้ทีละคน ===== */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-1">เพิ่มผู้ใช้ (ทีละคน)</h2>
        <p className="text-sm text-slate-400 mb-5">กรอกรหัสนิสิต แล้วกดเพิ่ม</p>

        <div className="flex gap-3">
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handelinput_student()}
            placeholder="เช่น 6509012345678"
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 outline-none focus:border-[#FFCB05] transition-colors"
          />
          <button
            onClick={handelinput_student}
            disabled={loading || !studentId.trim()}
            className="px-6 py-3 rounded-xl bg-[#1e293b] text-[#FFCB05] font-bold shadow hover:shadow-md transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            เพิ่ม
          </button>
        </div>
      </section>

      {/* ===== อัปโหลดไฟล์ Excel/CSV ===== */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-1">เพิ่มผู้ใช้จำนวนมาก (Excel/CSV)</h2>
        <p className="text-sm text-slate-400 mb-5">อัปโหลดไฟล์ .xlsx หรือ .csv ที่มีคอลัมน์รหัสนิสิต</p>

        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-[#FFCB05] transition-colors">
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange} // 💡 ผูกฟังก์ชันอ่านไฟล์
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-2xl">📄</div>
            <p className="text-sm font-medium text-slate-600">คลิกเพื่อเลือกไฟล์ (xlsx, xls, csv)</p>
          </label>

          {fileName && (
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <span className="font-medium">ไฟล์:</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">{fileName}</span>
              <button onClick={clearFile} className="text-red-400 hover:text-red-600 text-xs cursor-pointer">ลบ</button>
            </div>
          )}
        </div>

        {previewIds.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-slate-700">พบรหัสนิสิต {previewIds.length} คน</p>
              <button
                onClick={handelUploadAll}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-green-500 text-white font-bold text-sm shadow hover:bg-green-600 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                อัปโหลดทั้งหมด
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                {previewIds.map((id, index) => (
                  <div key={`${id}-${index}`} className="px-2 py-1 bg-white rounded border border-slate-100 text-slate-600 font-mono">
                    {id}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

{/* ===== รายชื่อผู้ใช้ ===== */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 w-full mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">รายชื่อผู้ใช้ทั้งหมด ({user.length})</h2>
            <p className="text-sm text-slate-400">แสดงรหัสนิสิตและสีที่ได้รับ</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* ส่วนของแท็บเลือกสีเพื่อคัดกรอง หรือจัดกลุ่ม */}
            <div className="flex flex-wrap gap-2">
              {arr_color.map((item) => {
                const isActive = actionh_color === item;
                const config = colorVariants[item];
                return (
                  <button
                    key={item}
                    onClick={() => handel_getuser(item)}
                    className={`px-3 py-1.5 rounded-xl border transition-all font-medium text-xs cursor-pointer active:scale-95 ${
                      isActive 
                        ? `${config.bg} ${config.text} border-transparent shadow-sm scale-105` 
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {config?.label || item}
                  </button>
                )
              })}
            </div>

            {/* 💡 ปุ่มดาวน์โหลดไฟล์ Excel */}
            <button
              onClick={handleDownloadExcel}
              disabled={user.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>📥</span> โหลดเป็น Excel
            </button>
          </div>
        </div>

        {user.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">ยังไม่มีผู้ใช้ในระบบ</p>
        ) : (
          <div className="max-h-72 overflow-y-auto">
            <div className="grid gap-2">
              {user.map((u:any) => (
                <div key={u.student_id} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-mono text-sm text-slate-700">{u.student_id}</span>
                  <span className="text-slate-700 text-sm">{u.name}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    u.color ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-500"
                  }`}>
                    {colorVariants[u.color]?.label || u.color || "ยังไม่ได้สุ่ม"}
                  </span>

                  <button onClick={() => handel_delete(u.token)} className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
                    <FontAwesomeIcon icon={faTrash}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}