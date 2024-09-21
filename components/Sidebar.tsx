"use client";

import { sidebarLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import ConnectWallet from "./shared/ConnectWallet";

const Sidebar = () => {
  const pathname = usePathname();
  const user = { 
    name: "John Doe", 
    profileImg: "/path/to/profile.jpg" 
  };

  return (
    <section className="sidebar p-4 bg-gray-800 text-white min-h-screen">
      <nav className="flex flex-col gap-4">
        <Link
          href="/dashboard"
          className="mb-8 flex items-center gap-2"
        >
          <Image
            src="/lisk_logo.png"
            width={34}
            height={34}
            alt="logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo text-2xl font-bold text-black-2 ">Lisk Earn</h1>
        </Link>

        <div className="my-0">
            <ConnectWallet />
        </div>

        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          return (
            <Link href={item.route} key={item.label} className={`sidebar-link flex items-center gap-3 p-2 rounded-md transition ${isActive ? 'bg-blue-700' : 'hover:bg-blue-500'}`}>
              <div className="relative size-6">
                <Image src={item.imgURL} alt={item.label} width={24} height={24} className={cn('transition', {'brightness-[3] invert-0': isActive})} />
              </div>
              <p className={cn('sidebar-label font-medium', {'text-white': isActive})}>
                {item.label}
              </p>
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default Sidebar;
