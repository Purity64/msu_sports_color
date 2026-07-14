// proxy.ts (อย่าลืมเปลี่ยนชื่อไฟล์จาก middleware.ts)
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!token) {
    if (pathname.startsWith("/home") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  const userRole = token.role as string; 

  if (pathname === "/" || pathname.startsWith("/login")) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url)); 
    }
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // 3. กรณี: ป้องกัน User ทั่วไป แอบเข้าหน้า Admin
  if (pathname.startsWith("/admin")) {
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/home", req.url)); 
    }
  }

  // 4. กรณี: ป้องกัน Role แปลกปลอมเข้าหน้า Home
  if (pathname.startsWith("/home")) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url)); 
    }
    if (userRole !== "user" && userRole !== "admin") { 
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// 💡 ต้องเพิ่ม "/" และ "/login" เข้าไปใน matcher ด้วย เพื่อให้ Middleware ดักจับและเด้งหน้าให้ถูกต้อง
export const config = {
  matcher: [
    "/",
    "/login",
    "/home/:path*",
    "/admin/:path*",
  ],
};