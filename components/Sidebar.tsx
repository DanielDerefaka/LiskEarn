"use client";

import { sidebarLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

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
          className="mb-12 flex items-center gap-2"
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

        <div className="mt-auto flex items-center gap-3 p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition">
          <Image
            src={user.profileImg}
            width={34}
            height={34}
            alt="User Profile"
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-medium">{user.name.split(' ')[0]}</p>
            <Link href="/Userprofile" className="text-xs text-blue-300 hover:text-blue-500">View Profile</Link>
          </div>
        </div>
      </nav>
    </section>
  );
};

export default Sidebar;
