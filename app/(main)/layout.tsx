// import Sidebar from "@/components/Sidebar";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { Poppins } from "next/font/google";
// import MobileNav from "@/components/MobileNav";


import {redirect} from 'next/navigation'
import MobileNav from "@/components/MobileNav";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"], // Add the weights you need
    variable: "--font-poppins", // Optional: for using as a CSS variable
  });
  

export  default async function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <section className={`${poppins.className} flex h-screen w-full font-inter `}>
        
        <Sidebar  />
        <div className="flex size-full flex-col ">
          <div className="root-layout">
            <Image src="/lisk_logo.png" alt="logo" width={30} height={30} />
            <div>
            <MobileNav />
            </div>
          </div>
          {children}
        </div>

        
      </section>
    </html>
  );
}
