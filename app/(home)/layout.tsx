import Home_Nev from "@/component/home/nev/Home_Nev";
import { isLogin } from "@/lib/Islogin";
import { notFound } from "next/navigation";
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!(await isLogin())) {
    return notFound(); 
  }
  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 py-4">
        <Home_Nev  />
        <div className="w-full max-w-6xl flex-1 mt-6">
          {children}
        </div>
    </div>
        
  );
}