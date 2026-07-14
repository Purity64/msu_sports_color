"use server";
import { pool } from "@/lib/db"
import {  isLoginadmin } from "@/lib/Islogin"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

export const GetOpen = async() => {
    try {
        if (await isLoginadmin()) {
            const [rows]:any = await pool.query("SELECT open_random FROM settings WHERE  id = 1 ");
            if (rows.length === 0) {
                return false;
            }
            
            return rows[0].open_random;
        }else{
            return false;
        }
    } catch (error) {
        console.log("GetusetList Error : ", error);
        return false;
    }
}

export const GetUsersByColor = async(color:string) => {
    try {
        if (await isLoginadmin()) {
            let sql  = "SELECT * FROM user WHERE  color = ?";
            let patam = [color];
            if (color === "null" || color === null) {
                sql = "SELECT * FROM user WHERE color IS NULL";
                patam =[];
            }
            
            const [rows]:any = await pool.execute(sql,[color]);
            if (rows.length === 0) {
                return [];
            }
            
            return rows;
        }else{
            return [];
        }
    } catch (error) {
        console.log("GetUsersByColor Error : ", error);
        return [];
    }
}