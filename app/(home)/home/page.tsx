import Home_RanDomBox from "@/component/home/body/Home_RanDomBox";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import Home_detail from "@/component/home/body/Home_detail";

// 💡 ใส่ async ที่ฟังก์ชันหลักของ Page
async function page() {
  const session = await getServerSession(authOptions);
  
  const [rows]: any = await pool.execute(
    "SELECT color FROM user WHERE token = ? LIMIT 1",
    [session?.user.token as string]
  );

  const userColor = rows[0]?.color; 
  const [rows_uselist]:any = await pool.execute("SELECT * FROM user WHERE color = ? AND role = 'user' ",[userColor]);

  

  
  
  return (
    <div className="w-full flex items-center justify-center p-2">
      {userColor ? (
        <Home_detail color={userColor}  uselist={rows_uselist} />
      ) : (
        <Home_RanDomBox />
      )}
    </div>
  );
}

export default page;