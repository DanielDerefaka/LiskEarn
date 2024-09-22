"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { getEthEarnContract } from '@/lib/ContractInteraction';
import { useConnectionContext } from "@/context/isConnected"



const layout = ({children}: {children: React.ReactNode}) => {
  return (
   <section className='h-full'>
      <Navbar/> 
      {children}
   </section>
  )
}

export default layout