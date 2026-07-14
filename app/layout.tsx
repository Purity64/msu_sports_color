import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BackgroundDecorations } from "@/component/layout/BackgroundDecorations";
import { Providers } from "./providers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MSU กีฬาสี",
  description: "ระบบจัดการกีฬาสี มหาวิทยาลัยมหาสารคาม",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col  bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]">
        
        <Providers>
          <BackgroundDecorations />
          <div className="relative z-10 flex flex-col flex-1 overflow-y-auto">
            {children}
          </div>
        </Providers>

      </body>
    </html>
  );
}