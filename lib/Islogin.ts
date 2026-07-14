import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { pool } from "./db";
export async function isLogin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token as string;
  const [rows]:any = await pool.execute("SELECT role FROM user WHERE token = ?",[token]);

  if (session?.user?.email && session.user.token && session.user.role === "user" && rows.length > 0 && rows[0].role === session.user.role) {
    return true;
  }

  return false;
}

export async function isLoginadmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token as string;
  const [rows]:any = await pool.execute("SELECT role FROM user WHERE token = ?",[token]);

  if (session?.user?.email && session.user.token && session.user.role === "admin" && rows.length > 0 && rows[0].role === session.user.role) {
    return true;
  }

  return false;
}


export async function getStudentID(email:string) {
    const emailParts = email.split("@");
    const prefix = emailParts[0]; 
    const stdID = prefix.split("-")[0];

    return stdID;
}

