import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { pool } from "@/lib/db";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { prompt: "consent", access_type: "offline", response_type: "code", hd: "msu.ac.th" },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        if (!profile.email.endsWith("@msu.ac.th")) {
          return "/?error=AccessDenied";
        }

        try {
          // 2. แกะรหัสนิสิตออกจากอีเมล
          const emailParts = profile.email.split("@");
          const prefix = emailParts[0]; // "68011212003-st"
          const stdID = prefix.split("-")[0]; // "68011212003"

          // 3. ค้นหาใน MySQL
          const [user_rows]: any = await pool.execute(
            "SELECT student_id FROM user WHERE student_id = ?",
            [stdID]
          );

          if (!user_rows || user_rows.length === 0) {
            console.log(`Login ปฏิเสธ: ไม่พบรหัส ${stdID} ในระบบฐานข้อมูล`);
            return "/?error=UserNotFound"; 
          }

          return true;

        } catch (error) {
          console.error("Database error during signIn:", error);
          return "/?error=ServerError";
        }
      }
      return "/?error=AccessDenied"; 
    },

    async jwt({ token, user, account, profile }) {
      if (account && user && profile?.email) {
        try {
          const emailParts = profile.email.split("@");
          const stdID = emailParts[0].split("-")[0];

          const [user_rows]: any = await pool.execute(
            "SELECT token, role FROM user WHERE student_id = ?",
            [stdID]
          );

          const [update]:any = await pool.execute("UPDATE user SET name = ?",[user.name as string]);

          if (user_rows.length > 0) {
            token.customToken = user_rows[0].token;
            token.role = user_rows[0].role;
          }
        } catch (error) {
          console.error("JWT Error:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.token = token.customToken as string;
        session.user.role = token.role as string; 
      }
      return session;
    },
  },
  pages: { error: "/" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };