"use server";
import { pool } from "@/lib/db"
import {  isLogin } from "@/lib/Islogin"
export const GetMessageGroup = async(color:string) => {
    try {
        if (await isLogin()) {
            const [rows]:any = await pool.execute("SELECT message_like FROM color  WHERE color = ?",[color]);
            if(rows.length === 0 ) return null;
            return rows[0].message_like;
        }else{
            return null;
        }
    } catch (error) {
        return null;
    }
}