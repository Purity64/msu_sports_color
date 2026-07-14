import { pool } from "@/lib/db"
import { isLogin } from "@/lib/Islogin"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

export const GetUserList = async() => {
    try {
        if (await isLogin()) {
            const color = await GetColor();
            const [rows]:any = await pool.execute("SELECT * FROM user WHERE color = ? AND role = 'user' ",[color]);
            if (rows.length === 0) {
                return [];
            }
            return rows;
        }else{
            return [];
        }
    } catch (error) {
        console.log("GetusetList Error : ", error);
        return [];
    }
}

export const GetColor = async() => {
    try {
        const session = await getServerSession(authOptions);
        if (await isLogin()) {
            const [rows]:any = await pool.execute("SELECT color FROM user WHERE token = ? AND role = 'user' ",[session?.user.token as string]);
            if (rows.length === 0) {
                return null;
            }
            return rows[0].color;
        }else{
            return null;
        }
    } catch (error) {
        console.log("GetColor Error : ", error);
        return null;
    }
}